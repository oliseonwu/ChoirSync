const { generateOtpCode, isDateExpired } = require("../utils/helpers");
const { getUserByEmail } = require("../utils/helpers");
const { OTP_EXPIRY } = require("../config/constants");
const axios = require("axios");

/**
 * Stores or updates OTP code for a user
 * @param {Parse.User} user - The user to store code for
 * @returns {Promise<Object>} Object containing the generated code
 */
async function storeOtpCode(user) {
  if (!user) {
    throw new Error("User is required");
  }

  // Generate a new OTP code
  const code = generateOtpCode();

  try {
    // Check if user already has an OTP code
    const query = new Parse.Query("Otp");
    query.equalTo("user_pointer", user.toPointer());
    const existingOtp = await query.first({ useMasterKey: true });

    // Update existing or create new
    const otpObject = existingOtp || new Parse.Object("Otp");
    otpObject.set("code", code);
    otpObject.set("redeemed_by_user", false);
    otpObject.set("verified_by_user", false);
    otpObject.set("user_pointer", user.toPointer());

    await otpObject.save(null, { useMasterKey: true });

    return { code };
  } catch (error) {
    console.error("Error storing OTP code:", error);
    throw new Error(`Failed to store OTP code: ${error.message}`);
  }
}

/**
 * Sends OTP code to user's email address using EmailJS REST API
 * @param {string} email - Recipient email address
 * @param {string} code - OTP code to send
 * @returns {Promise<Object>} Result of email sending operation
 */
async function sendOtpEmail(email, code) {
  if (!email || !code) {
    throw new Error("Email and code are required");
  }

  try {
    const templateParams = {
      email: email,
      passcode: code,
    };

    // Get environment variables from Parse
    const serviceId = process.env.EMAIL_JS_SERVICE_ID;
    const templateId = process.env.EMAIL_JS_TEMPLATE_ID;
    const userId = process.env.EMAIL_JS_PUBLIC_KEY;
    const accessToken = process.env.EMAIL_JS_PRIVATE_KEY;

    // Use axios for the REST call to EmailJS
    const response = await axios.post(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        service_id: serviceId,
        template_id: templateId,
        user_id: userId,
        accessToken: accessToken,
        template_params: templateParams,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`EmailJS API returned status ${response.status}`);
    }

    return {
      success: true,
      message: "OTP code sent successfully",
      status: response.status,
    };
  } catch (error) {
    console.error("Error sending OTP email:", error);

    throw new Error("Error sending OTP email:", error);
  }
}

/**
 * Verifies if provided code matches user's stored OTP code
 * @param {Object} request - Parse Cloud request object
 * @returns {Promise<Object>} Verification result
 */
async function verifyOtpCode(request) {
  const { code, email } = request.params;
  const user = await getUserByEmail(email);

  if (!user || !code) {
    throw new Error("User and code are required");
  }

  try {
    const storedCodeObject = await getOtpCodeObjectForUser(user);
    const storedCode = storedCodeObject.get("code");
    const isCodeValid = storedCode === code;
    const isCodeExpired = isDateExpired(
      storedCodeObject.get("updatedAt"),
      OTP_EXPIRY
    );
    const isCodeVerified = storedCodeObject.get("verified_by_user");

    if (!isCodeValid || isCodeExpired || isCodeVerified) {
      throw new Error("Invalid or expired OTP code");
    }

    await setOtpCodeAsVerified(storedCodeObject);

    return {
      success: true,
      isCodeValid,
    };
  } catch (error) {
    console.error("Error verifying OTP code:", error);
    throw new Error(`Failed to verify OTP code: ${error.message}`);
  }
}

/**
 * Gets OTP code object for a user
 * @param {Parse.User} user - User to get code for
 * @returns {Promise<Parse.Object>} The OTP code object
 */
async function getOtpCodeObjectForUser(user) {
  const query = new Parse.Query("Otp");
  query.equalTo("user_pointer", user.toPointer());
  const otpObject = await query.first({ useMasterKey: true });

  if (!otpObject) {
    throw new Error("No OTP code found for this user");
  }

  return otpObject;
}

/**
 * Redeems an OTP codeObject
 * @param {object} codeObject - The OTP code to redeem
 * @returns {Object} Result of redemption operation
 * @property {boolean} success - Whether the redemption was successful
 * @property {string} message - Message describing the result
 */
async function redeemOtpCode(codeObject) {
  codeObject.set("redeemed_by_user", true);
  await codeObject.save(null, { useMasterKey: true });
  return {
    success: true,
    message: "OTP code redeemed successfully",
  };
}

/**
 * set otp Code as verified by user. This means the user completed the verification process
 * @param {object} codeObject - The OTP code to set as verified
 * @returns {Object} Result of setting OTP code as verified
 * @property {boolean} success - Whether the setting was successful
 * @property {string} message - Message describing the result
 */
async function setOtpCodeAsVerified(codeObject) {
  codeObject.set("verified_by_user", true);
  await codeObject.save(null, { useMasterKey: true });
  return {
    success: true,
    message: "OTP code verified successfully",
  };
}

module.exports = {
  storeOtpCode,
  sendOtpEmail,
  verifyOtpCode,
  getOtpCodeObjectForUser,
  redeemOtpCode,
  setOtpCodeAsVerified,
};

/**
 * Creates a Parse Pointer object
 * @param id - The id of the object to point to
 * @param className - The class name of the object to point to
 * @returns A Parse Pointer object
 */
function pointer(id: string, className: string) {
  return {
    __type: "Pointer",
    className,
    objectId: id,
  };
}

function decodeJWT(token: string) {
  try {
    // JWT has 3 parts: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format");
    }

    // The payload is the second part (base64url encoded)
    const payloadBase64 = parts[1];

    // Convert base64url to regular base64
    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");

    // Decode base64 to string and parse JSON
    const jsonString = atob(base64);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

function throwErrorWithMessage(customMessage: string, error: any) {
  throw new Error(customMessage + error.message);
}

function throwError(error: any) {
  throw new Error(error.message);
}

export { pointer, decodeJWT, throwErrorWithMessage, throwError };

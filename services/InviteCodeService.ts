import Parse from "./Parse";

class InviteCodeService {
  async regenerateInviteCode(groupId: string) {
    try {
      return await Parse.Cloud.run("regenerateInviteCode", { groupId });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async validateInviteCode(code: string, groupId: string) {
    try {
      return await Parse.Cloud.run("validateInviteCode", { code, groupId });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async fetchInviteCode(groupId: string) {
    try {
      return await Parse.Cloud.run("fetchInviteCode", { groupId });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async addUserToChoirGroup(groupId: string, userId: string) {
    try {
      return await Parse.Cloud.run("addUserToChoirGroup", { groupId, userId });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export const inviteCodeService = new InviteCodeService();

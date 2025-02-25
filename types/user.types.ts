export type GoogleUser = {
  id: string;
  email: string;
  givenName: string | null;
  familyName: string | null;
  photo?: string | null;
  name?: string | null;
};

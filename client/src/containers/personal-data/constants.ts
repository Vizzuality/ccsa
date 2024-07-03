type FormDataFieldsProps = {
  label: string;
  name: "email" | "username" | "organization";
  type: string;
  placeholder: string;
}[];

export type FormPasswordFieldsProps = {
  label: string;
  name: "password" | "newPassword" | "passwordConfirmation";
  type: string;
  placeholder: string;
}[];

export const FORM_DATA_FIELDS: FormDataFieldsProps = [
  {
    label: "Name",
    name: "username",
    type: "text",
    placeholder: "Enter your name",
  },
  {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "Enter your email address",
  },
  {
    label: "Organization",
    name: "organization",
    type: "text",
    placeholder: "Enter your organization name",
  },
];

export const FORM_PASSWORD_FIELDS: FormPasswordFieldsProps = [
  {
    label: "Current password",
    name: "password",
    type: "password",
    placeholder: "Enter your current password",
  },
  {
    label: "New password",
    name: "newPassword",
    type: "password",
    placeholder: "Enter your new password",
  },
  {
    label: "Confirm new password",
    name: "passwordConfirmation",
    type: "password",
    placeholder: "Confirm your new password",
  },
];

// Attachment uploads are built in Lesson 7. Until then the picker is shown only
// in development, so nobody picks a file that would not be saved.
export const attachmentsEnabled = process.env.NODE_ENV !== "production";
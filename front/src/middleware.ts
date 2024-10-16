export { default } from "next-auth/middleware";

export const config = {
  // Note: Is very common to protect dashboard pages, you can change it to your needs
  // Protecting only /dashboard path
  matcher: ["/dashboard/:path*"],
};

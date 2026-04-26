import LegalDocument from "@/components/LegalDocument";

export const metadata = {
  title: `Terms & Privacy — ${process.env.NEXT_PUBLIC_DISPLAY_NAME}`,
  description: "Terms of service and privacy policy for VolIoT Inc.",
};

export default function TermsPage() {
  return <LegalDocument />;
}

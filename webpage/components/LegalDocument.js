const LAST_UPDATED = "April 25, 2026";
const CONTACT_EMAIL = "andy@voliotinc.com";

export default function LegalDocument() {
  const displayName = process.env.NEXT_PUBLIC_DISPLAY_NAME;
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
  const location = process.env.NEXT_PUBLIC_LOCATION;
  const smsNumber = process.env.NEXT_PUBLIC_SMS_NUMBER;

  return (
    <main className="min-h-screen px-6 py-16">
      <article className="max-w-3xl mx-auto text-white/90 leading-relaxed">
        <header className="mb-12 border-b border-white/20 pb-8">
          <p className="uppercase tracking-[0.3em] text-sm text-white/70 mb-4">
            Legal
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
            Terms of Service &amp; Privacy Policy
          </h1>
          <p className="text-white/70 text-sm">
            {displayName} &middot; Last updated {LAST_UPDATED}
          </p>
          <p className="text-white/70 text-sm mt-1">
            Questions:{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="underline hover:text-white"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">
            Terms of Service
          </h2>

          <p className="mb-6">
            These Terms of Service (&ldquo;Terms&rdquo;) govern your access to
            and use of the websites, software, hardware, and services
            (collectively, the &ldquo;Services&rdquo;) provided by{" "}
            {displayName} (&ldquo;VolIoT,&rdquo; &ldquo;we,&rdquo;
            &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By accessing or using the
            Services, you agree to be bound by these Terms.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-3">
            1. Acceptance of Terms
          </h3>
          <p className="mb-4">
            By accessing the Services, you confirm that you are at least 18
            years old or have the legal capacity to enter into these Terms in
            your jurisdiction. If you are using the Services on behalf of an
            organization, you represent that you have authority to bind that
            organization to these Terms.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-3">
            2. Description of Services
          </h3>
          <p className="mb-4">
            VolIoT designs and operates IoT systems including embedded sensors,
            edge devices, cloud dashboards, and related infrastructure. The
            specific scope of any engagement is defined in a separate written
            agreement, statement of work, or order. These Terms supplement that
            agreement.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-3">
            3. Your Obligations
          </h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Use the Services only for lawful purposes.</li>
            <li>
              Provide accurate information and keep your account credentials
              secure.
            </li>
            <li>
              Do not attempt to disrupt, reverse engineer, or gain unauthorized
              access to the Services or to any data that is not yours.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-white mt-8 mb-3">
            4. Intellectual Property
          </h3>
          <p className="mb-4">
            VolIoT retains all rights, title, and interest in the software,
            firmware, designs, and infrastructure that power the Services. You
            retain all rights to the data you generate or collect through the
            Services and to any deployments you own. Nothing in these Terms
            transfers ownership of your data to VolIoT.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-3">
            5. Disclaimers
          </h3>
          <p className="mb-4">
            The Services are provided &ldquo;as is&rdquo; and &ldquo;as
            available&rdquo; without warranties of any kind, whether express or
            implied. We do not warrant that the Services will be uninterrupted,
            error-free, or fit for a particular purpose beyond what is
            explicitly agreed in a separate written contract.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-3">
            6. Limitation of Liability
          </h3>
          <p className="mb-4">
            To the maximum extent permitted by law, VolIoT shall not be liable
            for any indirect, incidental, special, consequential, or punitive
            damages arising from your use of the Services. Our total liability
            for any claim arising out of these Terms is limited to the amount
            you paid us for the Services in the twelve months preceding the
            claim, or one hundred U.S. dollars, whichever is greater.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-3">
            7. Termination
          </h3>
          <p className="mb-4">
            You may stop using the Services at any time. We may suspend or
            terminate your access if you violate these Terms or if continued
            provision of the Services becomes commercially impracticable. On
            termination, sections that by their nature should survive
            (intellectual property, disclaimers, limitation of liability,
            governing law) will survive.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-3">
            8. Governing Law
          </h3>
          <p className="mb-4">
            These Terms are governed by the laws of the State of Tennessee,
            United States, without regard to conflict-of-laws principles. Any
            dispute will be resolved in the state or federal courts located in
            {location ? ` ${location}` : " Tennessee"}.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-3">
            9. Contact
          </h3>
          <p className="mb-4">
            Questions about these Terms can be sent to{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="underline hover:text-white"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Privacy Policy</h2>

          <p className="mb-6">
            This Privacy Policy explains what information VolIoT collects, why
            we collect it, and how we handle it. Our position is simple: data
            about you is yours. We are deliberately structured to keep it that
            way.
          </p>

          <div className="border-2 border-white rounded-2xl p-6 my-8 bg-white/5">
            <h3 className="text-2xl font-bold text-white mb-3">
              We do not sell your data.
            </h3>
            <p className="mb-2">
              VolIoT does not sell, rent, trade, or share your personal data
              with third parties for marketing or any other purpose. Data we
              collect about you is yours to collect and distribute as you see
              fit.
            </p>
            <p>
              We only share your data with you, or with a party you have
              explicitly authorized. Under no circumstance do we provide it to
              anyone else.
            </p>
          </div>

          <h3 className="text-xl font-semibold text-white mt-8 mb-3">
            1. Information We Collect
          </h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong className="text-white">Account &amp; contact data</strong>{" "}
              &mdash; name, email address, phone number, and similar
              information you provide when you contact us, sign up, or enter
              into a contract with us.
            </li>
            <li>
              <strong className="text-white">Communications</strong> &mdash;
              the contents of emails, support messages, or SMS exchanges you
              send us.
            </li>
            <li>
              <strong className="text-white">Device &amp; telemetry data</strong>{" "}
              &mdash; if a customer deploys one of our IoT systems, the system
              generates operational data (sensor readings, device health,
              logs). This data belongs to the customer who owns the deployment.
            </li>
            <li>
              <strong className="text-white">Basic site analytics</strong>{" "}
              &mdash; standard server logs (IP address, user agent, timestamps)
              used only to operate and secure the website.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-white mt-8 mb-3">
            2. Why We Collect It
          </h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>To provide and operate the Services you have requested.</li>
            <li>To respond to inquiries and provide support.</li>
            <li>
              To send transactional or operational messages (including SMS)
              that you have explicitly opted into.
            </li>
            <li>
              To meet legal, accounting, and security obligations associated
              with running a business.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-white mt-8 mb-3">
            3. How We Share Data
          </h3>
          <p className="mb-4">
            We share data only in the narrow circumstances below, and never
            for marketing:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong className="text-white">With you</strong>, the person or
              party the data belongs to.
            </li>
            <li>
              <strong className="text-white">With parties you have
              explicitly authorized</strong> (for example, a colleague you
              add to your account).
            </li>
            <li>
              <strong className="text-white">With infrastructure
              subprocessors</strong> strictly necessary to deliver the
              Services &mdash; primarily Amazon Web Services, which hosts our
              infrastructure. These providers act on our instructions and are
              contractually bound to handle data accordingly.
            </li>
            <li>
              <strong className="text-white">When required by law</strong>{" "}
              &mdash; for example, in response to a valid legal process. If we
              ever receive such a request, we will challenge it where
              appropriate and notify you when we are legally permitted to do
              so.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-white mt-8 mb-3">
            4. Security
          </h3>
          <p className="mb-4">
            We use industry-standard practices to protect data, including
            encryption in transit (TLS), encryption at rest where supported by
            the underlying storage, least-privilege access controls, and
            audit logging. No system is perfectly secure, but we treat
            security as a first-class engineering concern.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-3">
            5. Data Retention
          </h3>
          <p className="mb-4">
            We retain personal data only as long as needed to provide the
            Services, comply with legal obligations, and resolve disputes.
            When data is no longer needed, we delete or anonymize it. You
            may request earlier deletion at any time.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-3">
            6. Your Rights
          </h3>
          <p className="mb-4">
            You have the right to access, correct, export, or delete personal
            data we hold about you. To exercise any of these rights, email{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="underline hover:text-white"
            >
              {CONTACT_EMAIL}
            </a>
            . We will respond within a reasonable time and at no charge.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-3">
            7. SMS Program
          </h3>
          <p className="mb-4">
            VolIoT operates an SMS program for transactional and operational
            messages (for example, account alerts, service notifications, and
            replies to inquiries you initiate). Messages are sent from{" "}
            {smsNumber || "our registered SMS sender"} via Amazon Web Services
            (Amazon SNS / 10DLC).
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong className="text-white">Opt-in.</strong> You receive SMS
              from us only after explicit consent &mdash; either through a
              signup form, a written agreement, or by initiating contact
              yourself.
            </li>
            <li>
              <strong className="text-white">Opt-out.</strong> Reply{" "}
              <strong className="text-white">STOP</strong> to any message to
              unsubscribe. After you opt out, you will receive a single
              confirmation message and no further SMS from that program.
            </li>
            <li>
              <strong className="text-white">Help.</strong> Reply{" "}
              <strong className="text-white">HELP</strong> for assistance, or
              email{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="underline hover:text-white"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </li>
            <li>
              <strong className="text-white">Frequency.</strong> Message
              frequency varies based on your account activity and the
              notifications you have enabled.
            </li>
            <li>
              <strong className="text-white">Cost.</strong> Message and data
              rates may apply. Check with your wireless carrier.
            </li>
            <li>
              <strong className="text-white">Privacy of phone numbers.</strong>{" "}
              We do not sell or share phone numbers or SMS opt-in data with
              third parties for marketing or any other purpose.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-white mt-8 mb-3">
            8. Children&rsquo;s Privacy
          </h3>
          <p className="mb-4">
            The Services are not directed to children under 13, and we do not
            knowingly collect personal information from them. If you believe a
            child has provided us with personal information, contact us and we
            will delete it.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-3">
            9. Changes to This Policy
          </h3>
          <p className="mb-4">
            We may update this policy from time to time. When we do, we will
            update the &ldquo;Last updated&rdquo; date at the top and, for
            material changes, post a notice on{" "}
            {rootDomain ? (
              <a
                href={`https://${rootDomain}`}
                className="underline hover:text-white"
              >
                {rootDomain}
              </a>
            ) : (
              "our website"
            )}
            .
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-3">
            10. Contact
          </h3>
          <p className="mb-4">
            Questions, requests, or concerns about your data can be sent to{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="underline hover:text-white"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

        <footer className="mt-12 pt-8 border-t border-white/20 text-xs text-white/50 tracking-wide">
          &copy; {new Date().getFullYear()} {displayName}. All rights reserved.
        </footer>
      </article>
    </main>
  );
}

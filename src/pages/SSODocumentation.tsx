export default function SSODocumentation() {
    return (
        <main className="min-h-screen w-full bg-slate-50 px-4 py-10">
            <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-sm">
                <header className="mb-8 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
                        Documentation
                    </p>
                    <h1 className="text-3xl font-semibold text-slate-900">
                        Alloc8 API – Microsoft 365 SSO Integration Guide
                    </h1>
                    <p className="text-sm leading-relaxed text-slate-600">
                        This document explains how to configure Single Sign-On (SSO) between
                        Alloc8 and Microsoft 365 (Microsoft Entra ID). Alloc8 acts as the
                        Service Provider (SP) and Microsoft Entra ID acts as the Identity
                        Provider (IdP).
                    </p>
                    <p className="text-xs font-mono text-slate-500">
                        Authentication protocol: OpenID Connect (OIDC)
                    </p>
                </header>

                <div className="space-y-8 text-sm text-slate-700">
                    <section>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Service Provider Details
                        </h2>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Production Environment
                        </p>
                        <div className="mt-3 overflow-hidden rounded-md border border-slate-200">
                            <table className="w-full border-collapse text-sm">
                                <tbody>
                                    <tr className="border-b border-slate-200 bg-slate-50">
                                        <th className="w-1/3 px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Application URL
                                        </th>
                                        <td className="px-4 py-2 font-mono text-xs text-slate-800">
                                            https://api.alloc8.admiralgroup.co.uk
                                        </td>
                                    </tr>
                                    <tr className="border-b border-slate-200">
                                        <th className="w-1/3 px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Identifier (Entity ID)
                                        </th>
                                        <td className="px-4 py-2 font-mono text-xs text-slate-800">
                                            https://api.alloc8.admiralgroup.co.uk
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="w-1/3 px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Reply URL (Redirect URI)
                                        </th>
                                        <td className="px-4 py-2 font-mono text-xs text-slate-800">
                                            https://api.alloc8.admiralgroup.co.uk/auth/microsoft/callback
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Local Development Environment (Testing)
                        </h2>
                        <div className="mt-3 overflow-hidden rounded-md border border-slate-200">
                            <table className="w-full border-collapse text-sm">
                                <tbody>
                                    <tr className="border-b border-slate-200 bg-slate-50">
                                        <th className="w-1/3 px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Frontend
                                        </th>
                                        <td className="px-4 py-2 font-mono text-xs text-slate-800">
                                            http://localhost:5174
                                        </td>
                                    </tr>
                                    <tr className="border-b border-slate-200">
                                        <th className="w-1/3 px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Backend API
                                        </th>
                                        <td className="px-4 py-2 font-mono text-xs text-slate-800">
                                            http://localhost:8082
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="w-1/3 px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Reply URL (Redirect URI)
                                        </th>
                                        <td className="px-4 py-2 font-mono text-xs text-slate-800">
                                            http://localhost:8082/auth/microsoft/callback
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-3 text-xs text-slate-600">
                            The Microsoft Entra ID application should include <span className="font-semibold">both</span> of
                                the following redirect URIs:
                        </p>
                        <pre className="mt-2 overflow-x-auto rounded-md bg-slate-900 p-3 text-xs text-slate-50">
                            <code className="font-mono">
                                https://api.alloc8.admiralgroup.co.uk/auth/microsoft/callback
								
                                http://localhost:8082/auth/microsoft/callback
                            </code>
                        </pre>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Microsoft Entra ID Configuration Steps
                        </h2>
                        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">
                            <li>Open the Microsoft Entra admin center.</li>
                            <li>Navigate to <span className="font-medium">Microsoft Entra ID</span>.</li>
                            <li>Select <span className="font-medium">App registrations</span>.</li>
                            <li>Click <span className="font-medium">New registration</span>.</li>
                        </ol>
                        <div className="mt-4 space-y-2 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm">
                            <p>
                                <span className="font-semibold">Application Name:</span> <span className="font-mono">Alloc8 SSO</span>
                            </p>
                            <p>
                                <span className="font-semibold">Supported account types:</span> Accounts in this
                                    organizational directory only
                            </p>
                            <p className="font-semibold">Add Redirect URI (Web platform):</p>
                            <pre className="mt-1 overflow-x-auto rounded-md bg-slate-900 p-3 text-xs text-slate-50">
                                <code className="font-mono">
                                    https://api.alloc8.admiralgroup.co.uk/auth/microsoft/callback
									
                                    http://localhost:8082/auth/microsoft/callback
                                </code>
                            </pre>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-900">Create Client Secret</h2>
                        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">
                            <li>Open the <span className="font-medium">Certificates &amp; secrets</span> blade.</li>
                            <li>Click <span className="font-medium">New client secret</span>.</li>
                            <li>Choose an appropriate description and expiry.</li>
                            <li>
                                Copy the generated <span className="font-medium">client secret value</span> immediately and
                                    store it securely. It cannot be retrieved again once you leave the
                                    page.
                            </li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-900">Information Required by Alloc8</h2>
                        <p className="mt-3 text-sm">
                            Provide the following values to the Alloc8 team so that the
                                integration can be completed:
                        </p>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                            <li>Tenant ID</li>
                            <li>Client ID (Application ID)</li>
                            <li>Client Secret (from Certificates &amp; secrets)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-900">Create a Test User in Microsoft 365</h2>
                        <p className="mt-3 text-sm">
                            To safely verify the SSO configuration, create or select a dedicated
                                non-production test user account in your Microsoft 365 tenant.
                        </p>
                        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
                            <li>
                                In the Microsoft Entra admin center, go to
                                {" "}
                                <span className="font-medium">Users</span>
                                {" "}
                                &rarr; <span className="font-medium">All users</span>.
                            </li>
                            <li>
                                Create a new user (for example
                                {" "}
                                <span className="font-mono text-xs">alloc8.test@yourdomain.com</span>
                                {" "}
                                ) or choose an existing test account that is allowed to sign in.
                            </li>
                            <li>
                                Ensure the user has any required Microsoft 365 license (as per your
                                    organisation&apos;s policies) and can successfully sign in to Microsoft 365.
                            </li>
                            <li>
                                Grant the test user access to the Alloc8 SSO application. Typically
                                this is done under
                                {" "}
                                <span className="font-medium">Enterprise applications</span>
                                {" "}
                                by locating the Alloc8 SSO app and assigning either the user
                                directly or a group that contains the user.
                            </li>
                            <li>
                                Optionally share the test user&apos;s username (UPN) with the Alloc8
                                    team if they need to map it to an internal Alloc8 user record for
                                    testing.
                            </li>
                        </ol>
                        <p className="mt-3 text-xs text-slate-600">
                            Once Alloc8 has enabled Microsoft 365 SSO for your environment, use
                                this test account to sign in via the Microsoft login option and
                                confirm the end-to-end flow works before rolling it out to regular
                                users.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-900">OpenID Metadata Endpoint</h2>
                        <p className="mt-3 text-sm">
                            The OpenID Connect metadata endpoint for your tenant is:
                        </p>
                        <pre className="mt-2 overflow-x-auto rounded-md bg-slate-900 p-3 text-xs text-slate-50">
                            <code className="font-mono">
                                https://login.microsoftonline.com/{"{tenant-id}"}/v2.0/.well-known/openid-configuration
                            </code>
                        </pre>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-900">Authentication Flow</h2>
                        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">
                            <li>User navigates to the Alloc8 login page.</li>
                            <li>Alloc8 redirects the user to the Microsoft login page.</li>
                            <li>User authenticates with Microsoft 365.</li>
                            <li>
                                Microsoft redirects back to the Alloc8 callback URL:
                                <span className="block font-mono text-xs text-slate-700">
                                    https://api.alloc8.admiralgroup.co.uk/auth/microsoft/callback
                                </span>
                                or
                                <span className="block font-mono text-xs text-slate-700">
                                    http://localhost:8082/auth/microsoft/callback
                                </span>
                            </li>
                            <li>Alloc8 validates the ID token against the OpenID configuration.</li>
                            <li>Alloc8 creates or updates the user session and logs the user in.</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-900">Required Permissions</h2>
                        <p className="mt-3 text-sm">
                            In the Microsoft Graph / API permissions configuration, ensure the
                                following delegated permissions are granted (and consented):
                        </p>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                            <li>
                                <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">
                                    openid
                                </span>
                            </li>
                            <li>
                                <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">
                                    profile
                                </span>
                            </li>
                            <li>
                                <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">
                                    email
                                </span>
                            </li>
                            <li>
                                <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">
                                    User.Read
                                </span>
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </main>
    );
}

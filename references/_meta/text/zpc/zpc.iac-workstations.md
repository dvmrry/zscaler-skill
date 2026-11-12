# How the ZPC IaC CLI Scanner, Visual Studio extension and JetBrains plugin scan templates on a workstation (zpc.iac-workstations)
Also called: zscanner; IaC CLI Scanner; Zscaler IaC Scan extension

The IaC CLI Scanner runs on Windows, macOS and Linux, scans IaC templates in the local file system, and can be integrated with a pre-commit hook to scan before every commit. [zpc.iac-workstations:cli-scanner-overview] The hub is [What Zscaler Posture Control (ZPC) is to administer: portal access, setup order, notifications and audit logs](kb:zpc.overview); the scan is in [What ZPC IaC Scan covers: entitlement, supported templates and operating systems, Bicep, skipping policies, disabling and alert status](kb:zpc.iac-scanning) and the repository and CI/CD integrations are in [How each ZPC IaC Scan version control and CI/CD integration is set up and behaves](kb:zpc.iac-integrations).

**CLI Scanner login and commands.** zscanner login asks for the region (EU, US or Custom) of the ZPC Admin Portal and opens the ZPC login page in a browser, or the IdP login page if SSO is configured. [zpc.iac-workstations:cli-scanner-login] The CLI scanner commands include login, logout, scan, update, version, cleanup, completion, help, info, policy list and config list. [zpc.iac-workstations:cli-scanner-commands] zscanner scan accepts -d for a folder (the repository or directory must be checked out from the specific branch first), --log-level and --log-file, and --iac-type; --show-remediation=false hides the remediation steps. [zpc.iac-workstations:cli-scanner-scan-options] When a newer CLI Scanner version is available, the CLI displays a message telling you to run the zscanner update command. [zpc.iac-workstations:cli-scanner-update-notice]

**Pre-commit.** The pre-commit hook needs the pre-commit framework (pip install pre-commit) and a .pre-commit-config.yaml in the IaC repository; once installed it scans IaC files on every git commit. [zpc.iac-workstations:cli-scanner-precommit] The macOS and Linux install steps are open [gap:zpc.iac-workstations:cli-install-steps].

**Visual Studio extension.** The Visual Studio extension scans Terraform, Helm, Kubernetes, ARM and CloudFormation templates with built-in policies for AWS, Azure and GCP resources, supports policy exemptions within a template, and scans individual files and directories in the workspace. [zpc.iac-workstations:vscode-capabilities] The extension introduction names Terraform, Kubernetes, Helm and CloudFormation templates. [zpc.iac-workstations:vscode-intro-templates] The extension commands are Scan File (also triggered automatically on save), Scan Workspace, Open Settings, Clear Scan Results, Install/Update (the Zscaler IaC binary the extension uses) and Sign Out. [zpc.iac-workstations:vscode-commands] VS extension login offers regions EU, US or Custom; violations are shown on the Problems tab. [zpc.iac-workstations:vscode-login-region]

**JetBrains plugin.** The JetBrains plugin scans Terraform, Kubernetes, Helm, ARM and CloudFormation templates; the IDEs listed include DataGrip, PhpStorm, RubyMine and WebStorm. [zpc.iac-workstations:jetbrains-ides] JetBrains plugin login offers regions EU or US, and the violation view shows policy description and ID, resource name and type, template type, file path and severity. [zpc.iac-workstations:jetbrains-login]

What to check:
1. The Visual Studio extension introduction names Terraform, Kubernetes, Helm and CloudFormation templates, while its key features also name ARM.

Not known (open gaps):
- Which CLI Scanner install steps belong to which OS [gap:zpc.iac-workstations:cli-install-steps]: settled by source-read or lab-test

Area: zpc.iac-workstations, its subjects in references/_meta/spine/zpc/zpc.iac-workstations.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpc/zpc.iac-integrations.md (How each ZPC IaC Scan version control and CI/CD integration is set up and behaves)
- links-to references/_meta/text/zpc/zpc.iac-scanning.md (What ZPC IaC Scan covers: entitlement, supported templates and operating systems, Bicep, skipping policies, disabling and alert status)
- links-to references/_meta/text/zpc/zpc.overview.md (What Zscaler Posture Control (ZPC) is to administer: portal access, setup order, notifications and audit logs)

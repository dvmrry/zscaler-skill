# Cloud Connector partner integration endpoints: AWS accounts in the contract, Azure and GCP outside it (cloud-connector.api.partner-integrations-wire)
Also called: ztw partner integrations api; publicCloudInfo; publicCloudTenant; azure account api cloud connector; gcp workload discovery api; discoveryService
Former IDs: cloud-connector-18

Partner integrations register cloud accounts so that workload tags can be used in policy. The AWS account, account group and discovery paths are generated from the contract; this subject records what the API covers per cloud.

## AWS

The AWS account, account group and discovery-service calls are in the contract and the generated surface: [The Cloud Connector API documents the AWS account (`/publicCloudInfo`), account group (`/accountGroups`) and discovery-service (`/discoveryService`) operations under its Partner Integrations tag.](kb:cloud-connector.workload-discovery:api-surface-generated). The trust settings they read and the Go SDK's decoding defect are in [The workload discovery settings read returns the Zscaler side of the trust: the ID of the Zscaler AWS account required in the AWS trust policy and the name of the trusted role in that account.](kb:cloud-connector.workload-discovery.aws-accounts:trust-settings-endpoint) and [cloud-connector.workload-discovery.aws-accounts:trust-settings-shape](kb:cloud-connector.workload-discovery.aws-accounts:trust-settings-shape), and the CloudFormation template URL in [The API returns the CloudFormation template URL; with the optional `awsAccountId` query parameter the URL is customized with account-specific values, otherwise a generic template URL is returned.](kb:cloud-connector.workload-discovery.aws-accounts:template-url-endpoint).

## Azure

The API overview says the Partner Integrations resources retrieve AWS accounts, AWS account groups, Microsoft Azure accounts and supported regions, and create, update and delete AWS accounts, AWS account groups and Azure accounts. [cloud-connector.api.partner-integrations-wire:help-partner-scope] Azure partner integrations let user-defined tags and resource attributes be used in Zscaler security policies: Zscaler configuration requires an Azure account, which maps to service principal credentials with access to a set of subscriptions in one tenant; the integration lets the admin configure permissions for Zscaler to discover workloads and their metadata from those subscriptions, and associate a Cloud Connector with the workload information to enforce policy. [cloud-connector.api.partner-integrations-wire:azure-partner-integration] Tag discovery services for Azure are in Limited Availability. [cloud-connector.api.partner-integrations-wire:azure-tag-discovery-la]

The captured contract has no Azure account path [divergence:cloud-connector.api.partner-integrations-wire:azure-accounts-api].

## GCP

GCP has a console-onboarded workload discovery service: [The workload discovery service is a Zscaler-managed service that discovers workloads in a GCP account and fetches their user-defined tags and provider-generated attributes for use in security policies.](kb:cloud-connector.gcp.workload-discovery:service). The captured contract has no GCP account or GCP discovery path; its workload discovery settings describe the trust in terms of a Zscaler AWS account. [cloud-connector.api.partner-integrations-wire:gcp-no-contract-path] Whether Azure and GCP account management has a public REST family, and which paths it uses, is open [gap:cloud-connector.api.partner-integrations-wire:azure-gcp-rest-family].

What to check:
1. For automation of Azure or GCP partner integration, whether the paths come from a current vendor reference, since the captured contract and the SDKs cover only AWS accounts.

Inferred, not quoted (say so when an answer rests on one):
- [cloud-connector.api.partner-integrations-wire:gcp-no-contract-path] Tier B: Absence by search: no path in the contract contains gcp or google (case-insensitive) at the pin.

Sources disagree (name both sides):
- Whether the API manages Azure accounts. [divergence:cloud-connector.api.partner-integrations-wire:azure-accounts-api]
  - zscaler-help: The API overview says Partner Integrations create, update, delete and retrieve Azure accounts.
  - api-specs: The captured contract has no `/publicCloudTenant` path, which the earlier reference text named for Azure accounts; its account paths are the AWS `/publicCloudInfo` family.
  Impact: Azure account automation cannot be built from the contract or the generated surface; the paths would have to come from a vendor reference not captured here.

Not known (open gaps):
- The REST paths for Azure and GCP partner integration [gap:cloud-connector.api.partner-integrations-wire:azure-gcp-rest-family] (data gap): filled by operator; settled by source-read or lab-test. Blocks: automating Azure or GCP partner integration through the API

Area: cloud-connector.api, its subjects in references/_meta/spine/cloud-connector/cloud-connector.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.workload-discovery.aws-accounts.md (Onboarding an AWS account for discovery: role, external ID and trust)
- links-to references/_meta/text/cloud-connector/cloud-connector.gcp.workload-discovery.md (Cloud Connector on GCP: workload discovery service)
- links-to references/_meta/text/cloud-connector/cloud-connector.workload-discovery.md (AWS workload discovery for Cloud Connector: what it is and how the pieces fit)

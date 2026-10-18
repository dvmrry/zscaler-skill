# Understanding Cloud Connector Deployments with Google Cloud Platform Managed Instance Groups with Autoscaling

**Source:** https://help.zscaler.com/cloud-branch-connector/understanding-cloud-connector-deployments-google-cloud-platform-managed-instance-groups-autoscaling
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1535452, revision 3203230

---

A Google Cloud Platform (GCP) Managed Instance Group (MIG) with autoscaling deployment dynamically adds Cloud Connector virtual machines (VMs) to an instance group to meet the current load when it increases, and it removes Cloud Connector VMs from the instance group when the load decreases. For example, consider a virtual Windows workstation deployment where users log in to their own virtual workstations at the beginning of the work day and log out at the end of the day. This causes fluctuations in the number of users and the amount of traffic flow during these periods.
Instance groups also constantly monitor the health of each Cloud Connector VM in the instance group. They remove unhealthy VMs from the instance group and replace them with healthy ones. If someone manually terminates a VM that is part of an instance group from the Google Cloud console, the instance group replaces the VM.
When deploying a Cloud Connector, only deploy an autoscaling group (ASG) with an ASG template or a non-ASG with a non-ASG template. Additionally, stopping or rebooting a VM that is part of an instance group from the Google Cloud console could cause the VM to be terminated.
Instance groups with autoscaling provide the following benefits:
- Dynamically scale the number of VMs in the instance group to match demand.
- Automatically remove unhealthy VMs and replaces them with healthy ones.
- Deploy VMs across availability zones for high availability. Load balancing distributes traffic among the VMs.
This article describes instance groups and how they work in a Cloud Connector deployment. The deployment template prompts you to configure certain instance group settings mentioned in this article. For information about the deployment template and the deployment steps, see Deployment Templates for Zscaler Cloud Connector and Deploying Zscaler Cloud Connector on the Google Cloud Platform. For comprehensive autoscaling information, refer to the GCP product documentation.
# Topology
The following sections provide a diagram depicting the topology of an autoscaling deployment and a description of its components and flow.
- Topology diagram
- Topology details
  - The security stack is deployed in either a dedicated GCP project or within the same project as the workloads, based on your organizational architecture. GCP has an architectural limitation where instances with multiple network interfaces require separate virtual private cloud (VPC) networks for each interface. Cloud Connector deployments therefore require the creation of two distinct VPCs: one for management and one for service and security operations. After the security stack is in place, you must configure custom routes in the workload VPCs to direct appropriate traffic to the load balancer in front of the Cloud Connectors. This load balancer serves as the central entry point for the security stack.
  - Zonal MIGs with autoscaling are deployed in each configured region or zone, ensuring high availability and automatic failover across zones.
  - A Cloud NAT gateway is deployed in each region for the Cloud Connectors. This arrangement provides managed, scalable outbound internet access and allocates dedicated external IPs for each gateway.
  - Two Google Cloud Run functions are deployed:
    - Health Monitoring: This function uses custom metrics exported from each Cloud Connector VM (for example, via Cloud Monitoring/Operations) to determine the health status of the VM. The instance group automatically terminates unhealthy Cloud Connector VMs and replaces them with new ones. The Health Monitoring function is triggered every minute by default using Cloud Scheduler.
    - Resource Sync: This function ensures that the VMs registered in the Zscaler Admin Console match the membership of each Cloud Connector instance group. If the function discovers a Cloud Connector in the Zscaler Admin Console that is not part of any instance group, it issues an API call to the Zscaler Admin Console to delete the VM. This function runs every 10 minutes by default.
  - The Resource Sync Cloud Run function uses RESTful APIs to communicate with the Cloud Connector API endpoint securely over HTTPS. The functions do not directly interact with individual Cloud Connector VMs; instead, they orchestrate via the Admin API.
  - Each Cloud Function is packaged in a ZIP file and deployed via Google Cloud Storage. The ZIP file is uploaded either to a newly created storage bucket during deployment or to an existing bucket specified in the deployment configuration. The Cloud Functions retrieve their code from this bucket during initialization.
# Scale-Out and Scale-In
Each Cloud Connector independently posts data plane CPU utilization metrics at one-minute intervals to GCP Cloud Monitoring as a user-defined metric. The MIG autoscaling policy uses the aggregate CPU utilization value across all VMs in the instance group to determine whether a scale-in or scale-out event should happen based on a target percentage value.
Auto Scaling uses custom CPU utilization metrics instead of VM-level metrics because custom metrics provide more detailed and precise information about CPU usage. In logs and reports, the CPU utilization metric is displayed as smedge_cpu_utilization.
- Scaling Policy
- The scaling policy manages scale-out and scale-in events using the following variables:
  - Target value: By default, the target value is 80% aggregate CPU utilization across all VMs in the instance group over a period of two to three minutes. Autoscaling maintains CPU utilization as close to the target value as possible without exceeding it.
  - Instance group size: When a scaling event happens, autoscaling automatically determines the number of VMs to add or remove to bring the aggregate CPU utilization metric closer to the target value. By default, the maximum size of an instance group is 10 VMs and the minimum size is one VM. (The maximum cannot exceed the Cloud Connector group limit of 16 VMs per group.)
- You can view the policy in the instance group details in the Google Cloud console.
- Cooldown Period
- While your VMs are initializing, the utilization metric might not reflect normal conditions. As a safeguard, autoscaling provides a cooldown (or initialization) period, which is the number of seconds between scaling actions.
  - For scale-in events, autoscaling takes into account utilization data from all VMs, even those that are still in the cooldown period.
  - For scale-out events, autoscaling ignores utilization data from VMs that are still in the cooldown period.
- By default, the initialization period is 900 seconds (15 minutes).
- Examples
- The following examples demonstrate how scaling events affect the size of an instance group with a minimum size of two, a maximum size of 5, and the default target value (80%):
- Scale-Out: Because the minimum instance group size is two, at least two VMs must always be running.
  - No scaling event happens in normal conditions with two VMs running at 60% aggregate CPU utilization.
  - If the aggregate CPU utilization exceeds 80%, a scale-out event happens, bringing the number of VMs in the instance group to three.
  - After the cooldown period, if the aggregated CPU utilization still exceeds 80%, another scale-out event adds one more VM to the instance group, bringing the number of VMs to 4. This continues after the cooldown period ends until the average is less than 80%.
- Scale-In: GCP autoscaling uses its own logic to determine what to do when the aggregate CPU utilization is less than 80%:
  - Wait because the value is too close to 80% or has not been under 80% long enough.
  - Trigger a scale-in event because, based on the time sample and the individual CPU utilization of each VM, removing one VM will meet the following criteria:
    - The number of VMs will be at or above the minimum target group size.
    - The average fluctuation for the remaining VM will likely remain below the target CPU utilization value.
# Cloud Connector Health Monitoring
Health monitoring includes the following entities:
- Custom Metric Publishing: Each Cloud Connector publishes a VM-level custom metric at one-minute intervals. This metric value is either 0 for an unhealthy VM or 100 for a healthy VM.
- Custom metrics also include dataplane CPU utilization metrics published at one-minute intervals, described in the previous section.
- Health Monitoring: The Health Monitor function consumes the health metric at one-minute intervals and initiates the termination of a VM that it determines is unhealthy. It uses two criteria to determine whether to terminate the VM:
  - Recent Health Data
  - The Health Monitor function evaluates recent health data using sliding window logic with the following configurable environment variables:
    - The size of the sliding window. The default is 10 consecutive minutes.
    - The amount of time the VM was in an unhealthy state. The default value for defining a VM as unhealthy is 5 consecutive minutes.
    - The tolerance for flapping values in the sliding window. The default value is 7 unhealthy counts in 10 consecutive minutes.
  - Missing Metrics
  - The Health Monitor function uses the following configurable environment variables to handle scenarios in which a running VM does not post metrics:
    - If the VM does not report metrics for two minutes, the function generates a warning log.
    - If the VM does not report metrics for 5 minutes, the function generates a critical log.
    - If the VM does not report metrics for 10 minutes, the function generates a termination log and starts the process of deleting the VM.
- Unhealthy VMs are terminated in iterations. By default, in a single iteration, 16 VMs can be terminated. After a VM is terminated, it is replaced immediately.
In logs and reports, the health metric is displayed as cloud_connector_aggr_health.
# Viewing Metrics and Logs
- Instance Group Details
- The details page for an instance group contains comprehensive information about the group, such as the capacity overview, configuration settings, scaling policy, instance management, activity history, metrics, and so on.
- To view the instance group details:
  - Open the Google Cloud console.
  - In the navigation pane, click Instance Groups.
  - Select the instance group for which you want to view details. The Overview tab opens.
  - See image.
  - Click the Details tab to review the instance status, template, configuration, location, group size, and autoscaling policy.
  - See image.
  - Click the Monitoring tab to review instance group metrics over a period of time.
  - See image.
- Cloud Connector VM Details
- To view details about a VM in the instance group:
  - Open the Google Cloud console.
  - In the navigation pane, click Instance Groups.
  - Select the instance group for which you want to view details.
  - On the Overview tab, in the VM instances section, click an instance in the Name column.
  - Click Observability to monitor VM health, behavior, and performance.
  - See image.
# Access to GCP Resources
Service accounts provide secure access to Google Cloud resources. Three service accounts are required in a GCP autoscaling deployment:
- Deployment Service Account
- This service account allows Terraform to run during deployment. It needs the following roles:
  - Compute Instance Admin (v1)
  - Compute Network Admin
  - Compute Security Admin
  - Service Account Admin
  - Service Account User
  - Secret Manager Admin
  - Project IAM Admin
  - DNS Administrator (optional)
  - Cloud Functions Admin (Autoscaling only)
  - Cloud Scheduler Admin (Autoscaling only)
  - Storage Admin (Autoscaling only)
- This service account also needs the following APIs enabled:
  - Compute Engine API
  - Cloud DNS API
  - Cloud Resource Manager API
  - Identity and Access Management (IAM) API
  - Secret Manager API
  - Autoscaling deployments only:
    - Cloud Functions API
    - Cloud Scheduler API
    - Cloud Monitoring API
    - Cloud Logging API
    - Cloud Build API
- Cloud Connector VM Service Account
- This service account allows Cloud Connectors to access secret credentials. It needs the following roles:
  - Monitoring Metric Writer
  - One of the following roles, depending on the method you use to manage and store your secret credentials:
    - Secret Manager Secret Accessor (for GCP Secret Manager)
    - Service Account Token Creator (for HashiCorp Vault) with the following permissions assigned to it:
      - compute.instanceGroups.list
      - compute.instances.get
      - iam.serviceAccounts.get
      - iam.serviceAccountKeys.get,
      - iam.serviceAccounts.signJwt
- Cloud Function Service Account
- This service account allows the Cloud Run Functions (Health Monitor and Resource Sync) to make API calls to perform operations such as reading metrics, terminating VMs, and replacing VMs. It needs the following roles:
  - Compute Instance Admin (v1)
  - Monitoring Viewer
  - Logs Writer
  - Cloud Run Invoker
  - One of the following roles, depending on the method you use to manage and store your secret credentials:
    - Secret Manager Secret Accessor (for GCP Secret Manager)
    - Service Account Token Creator (for HashiCorp Vault) with the following permissions assigned to it:
      - compute.instanceGroups.list
      - compute.instances.get
      - iam.serviceAccounts.get
      - iam.serviceAccountKays.get
      - iam.serviceAccounts.sign.Jwt
For information about creating service accounts and assigning roles, see Deploying Zscaler Cloud Connector on the Google Cloud Platform.

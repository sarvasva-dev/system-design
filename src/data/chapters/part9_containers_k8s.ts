import { Chapter } from '../../types';

export const PART9_CHAPTER: Chapter = {
  id: 'part9-containers-k8s',
  part: 9,
  partTitle: 'Part 9 — Containers & Kubernetes Architecture',
  chapterNumber: 9,
  title: 'Containers & Kubernetes Architecture',
  subtitle: 'Docker Linux Primitives, Pods, Deployments, Services, Ingress, StatefulSets & Control Plane Internals',
  summary: 'Containers package code and dependencies into immutable, portable images leveraging Linux kernel primitives (cgroups and namespaces). Kubernetes orchestrates these containers across fleets of physical machines, providing declarative desired-state reconciliation, automated rollouts, service discovery, and horizontal scaling.',
  diagramAscii: `
+--------------------------------------------------------------------------------------------------+
|                           KUBERNETES CONTROL PLANE & WORKER ARCHITECTURE                         |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   [ kubectl / CI-CD ] ---> ( HTTPS REST / Port 6443 )                                            |
|                                   |                                                              |
|                                   v                                                              |
|   +------------------------------------------------------------------------------------------+   |
|   | CONTROL PLANE (Master Nodes)                                                             |   |
|   |   +-------------------+       +-----------------------+       +----------------------+   |   |
|   |   |  kube-apiserver   | <---> | kube-controller-mgr   | <---> |    kube-scheduler    |   |   |
|   |   +-------------------+       +-----------------------+       +----------------------+   |   |
|   |             ^                                                                            |   |
|   |             | (Linearizable Raft Storage)                                                |   |
|   |             v                                                                            |   |
|   |   +-------------------+                                                                  |   |
|   |   |       etcd        | (3 or 5 Node Consensus Cluster)                                  |   |
|   |   +-------------------+                                                                  |   |
|   +------------------------------------------------------------------------------------------+   |
|                                   |                                                              |
|              +--------------------+--------------------+                                         |
|              | (Watch & Reconcile Stream)              |                                         |
|              v                                         v                                         |
|   +-------------------------------+         +-------------------------------+                    |
|   | WORKER NODE 1                 |         | WORKER NODE 2                 |                    |
|   |   +-----------------------+   |         |   +-----------------------+   |                    |
|   |   | kubelet               |   |         |   | kubelet               |   |                    |
|   |   +-----------------------+   |         |   +-----------------------+   |                    |
|   |   | kube-proxy (iptables) |   |         |   | kube-proxy (iptables) |   |                    |
|   |   | Container Runtime     |   |         |   | Container Runtime     |   |                    |
|   |   |   (containerd / CRI)  |   |         |   |   (containerd / CRI)  |   |                    |
|   |   +-----------------------+   |         |   +-----------------------+   |                    |
|   |   [ Pod A ]    [ Pod B ]      |         |   [ Pod C ]    [ Pod D ]      |                    |
|   +-------------------------------+         +-------------------------------+                    |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
`,
  concepts: [
    {
      title: 'Container Primitives: Namespaces, Cgroups, and UnionFS',
      confidence: 'stable',
      simpleDefinition: 'A container is NOT a virtual machine; it is a standard Linux process isolated by Namespaces (what it can see) and restricted by Cgroups (how much it can use).',
      whyItExists: 'Virtual machines require a full guest operating system, consuming gigabytes of RAM and taking minutes to boot. Containers share the host Linux kernel, booting in milliseconds with negligible overhead.',
      analogy: 'A virtual machine is a detached single-family house with its own plumbing, electrical generator, and roof. A container is an apartment in a high-rise building: it has its own private room and key (namespaces), but shares the building’s foundation, water mains, and power grid (host Linux kernel).',
      technicalExplanation: 'Linux Namespaces provide process isolation: `pid` (process IDs), `net` (network interfaces, IP routing, ports), `mnt` (mount points and file systems), `ipc` (inter-process communication), `uts` (hostname), and `user` (user IDs). Control Groups (cgroups v2) enforce resource boundaries: CPU limits, memory limits, I/O throttling, and pids count. When a container exceeds its memory limit, the Linux kernel Out-Of-Memory (OOM) killer terminates it (`Exit Code 137`). OverlayFS (Union File System) stacks read-only image layers under a single ephemeral read-write container layer.',
      example: 'Running `docker run --memory 512m --cpus 1.5 nginx` creates a process wrapped in cgroups and namespaces that can never exceed 512MB RAM or 1.5 CPU cores.',
      whenToUse: ['Use containers for packaging all stateless microservices, web apps, and background task workers.'],
      whenNotToUse: ['Do not rely on containers alone for multi-tenant untrusted code execution (e.g., customer-submitted arbitrary Python scripts); use lightweight microVMs (AWS Firecracker / gVisor) for hardware-isolated virtualization boundaries.'],
      commonMistakes: [
        'Running containers as `root`: if an attacker breaks out of the container via a kernel vulnerability, they gain root access to the entire host server. Always use unprivileged non-root users.',
        'Not setting memory limits in Kubernetes manifests, allowing a memory leak in one container to trigger host-wide node starvation.'
      ],
      interviewQuestion: {
        question: 'What is the architectural difference between a Docker container and a KVM virtual machine?',
        answer: 'A KVM virtual machine runs on top of a hypervisor with its own virtualized hardware (vCPU, virtual NIC, virtual BIOS) and boots a complete guest operating system kernel. A container is simply an isolated Linux process running directly on the host operating system kernel, sharing the host kernel syscall interface. Containers have zero hypervisor translation overhead, near-instant startup, and tiny memory footprint, but share kernel vulnerabilities with the host.'
      }
    },
    {
      title: 'Kubernetes Workload Primitives: Pods, Deployments, and Services',
      confidence: 'stable',
      simpleDefinition: 'A Pod is the smallest deployable unit (one or more co-located containers); a Deployment manages rolling updates and replica counts; a Service provides a stable internal IP and load balancing across pods.',
      whyItExists: 'Containers are ephemeral: they die, restart, and get rescheduled to different nodes with new IP addresses. Services provide persistent networking and DNS names.',
      analogy: 'A Pod is an employee at a desk. A Deployment is the manager who ensures there are always 5 employees working, hiring replacements if someone calls in sick. A Service is the company phone number: customers call one number, and the switchboard routes to whichever employee has an open desk.',
      technicalExplanation: 'A Pod encapsulates one or more containers that share the same network namespace (localhost) and storage volumes. A Deployment manages a ReplicaSet, enabling declarative zero-downtime rolling updates (`RollingUpdate` strategy with `maxSurge` and `maxUnavailable`). A Service (`ClusterIP`, `NodePort`, `LoadBalancer`) selects pods via label selectors (`app: orders`) and assigns a stable virtual IP. `kube-proxy` programs Linux `iptables` or IPVS rules on each worker node to route service virtual IPs directly to pod IPs.',
      example: 'A Deployment specifies `replicas: 3`. When you push a new container image, Kubernetes creates a new ReplicaSet, boots 1 new pod, waits for its readiness probe to pass, terminates 1 old pod, and repeats until all 3 are updated.',
      whenToUse: [
        'Use Deployments for stateless HTTP servers, worker processes, and API gateways.',
        'Use StatefulSets for stateful databases (PostgreSQL, Kafka, ZooKeeper) requiring stable network IDs (`pod-0`, `pod-1`) and persistent volume claims.',
        'Use DaemonSets for node-level agents (logging daemons like Fluentd, monitoring daemons like Datadog).'
      ],
      whenNotToUse: [
        'Do not use raw naked Pods in production—if a naked pod dies, Kubernetes will never resurrect it.'
      ],
      commonMistakes: [
        'Confusing Liveness Probes and Readiness Probes: failing a liveness probe causes Kubernetes to kill and restart the container; failing a readiness probe simply removes the pod from the Service load balancer until it recovers. Using a database health check in a liveness probe causes cascading container restart loops during DB outages.'
      ],
      interviewQuestion: {
        question: 'What is the difference between a Liveness, Readiness, and Startup probe in Kubernetes?',
        answer: 'A Startup Probe checks if the application has completed initialization; all other probes are disabled until it passes, preventing slow-starting apps from being killed prematurely. A Liveness Probe checks if the process is alive (not deadlocked); if it fails, kubelet terminates the container and restarts it. A Readiness Probe checks if the container is ready to accept user network traffic; if it fails, kube-proxy removes the pod’s IP from the Service endpoints without killing the container, allowing it to warm caches or recover from temporary overload.'
      }
    },
    {
      title: 'Kubernetes Control Plane Internals & Reconciliation Loops',
      confidence: 'stable',
      simpleDefinition: 'The control plane constantly observes the current state of the cluster and makes changes until the current state matches the desired state (the Reconciliation Loop).',
      whyItExists: 'Distributed systems cannot rely on imperative commands ("run this now"). Declarative reconciliation ensures that if a server burns down, Kubernetes automatically replaces lost workloads.',
      analogy: 'A thermostat: you set desired temperature to 72°F. If the room drops to 65°F, the thermostat detects the difference and turns on the heater until the room hits 72°F again.',
      technicalExplanation: 'Core Control Plane components: (1) `kube-apiserver`: The only component that talks to `etcd`. Exposes REST API, handles authentication, authorization (RBAC), and admission controllers (validating/mutating webhooks). (2) `etcd`: Distributed, consistent key-value store using Raft. Stores all cluster state. (3) `kube-scheduler`: Watches for unscheduled pods and assigns them to nodes based on resource requests, node affinity, taints, and tolerations. (4) `kube-controller-manager`: Runs reconciliation loops (DeploymentController, NodeController, EndpointSliceController). Worker components: `kubelet` (node agent that talks to container runtime via CRI) and `kube-proxy` (networking rules).',
      example: 'If a worker node crashes, the NodeController detects missed heartbeats after 40 seconds, marks the node `NotReady`, and the DeploymentController schedules replacement pods onto healthy nodes.',
      whenToUse: ['Rely on declarative YAML manifests and GitOps (ArgoCD, Flux) to maintain desired state across all production clusters.'],
      whenNotToUse: ['Never execute imperative `kubectl edit` or `kubectl scale` commands directly in production clusters, as it creates configuration drift.'],
      commonMistakes: [
        'Overloading etcd: storing giant ConfigMaps (e.g., > 1MB) or running millions of rapid object updates in etcd degrades Raft consensus performance.'
      ],
      interviewQuestion: {
        question: 'Walk through the lifecycle of what happens when you run `kubectl apply -f deployment.yaml`.',
        answer: '1. `kubectl` validates YAML and sends HTTPS POST to `kube-apiserver`. 2. `kube-apiserver` authenticates user, checks RBAC, runs Mutating Webhooks, schema validation, and Validating Webhooks. 3. `kube-apiserver` writes Deployment object to `etcd`. 4. Deployment Controller watches apiserver, detects new Deployment, and creates a ReplicaSet object. 5. ReplicaSet Controller detects ReplicaSet and creates Pod objects with no `nodeName`. 6. `kube-scheduler` detects unscheduled pods, filters nodes based on resources/taints, scores candidate nodes, and binds each pod to a node (writes `nodeName` to apiserver). 7. `kubelet` on the assigned node observes the new pod via watch, calls Container Runtime Interface (CRI) to pull images, sets up network namespaces via CNI, and starts containers. 8. Kubelet updates pod status to `Running` in apiserver.'
      }
    }
  ],
  tradeOffAnalysis: {
    technologyA: 'Kubernetes Deployment (Stateless)',
    technologyB: 'Kubernetes StatefulSet (Stateful)',
    comparisonDimensions: [
      {
        dimension: 'Pod Identity',
        optionA: 'Random unique hashes (e.g., `web-7b94c-x89f`). Interchangeable.',
        optionB: 'Predictable, persistent ordinal index (`db-0`, `db-1`, `db-2`).',
        verdict: 'StatefulSet is required for clustered databases like Kafka/Cassandra.'
      },
      {
        dimension: 'Storage Binding',
        optionA: 'Ephemeral or shared PVC.',
        optionB: 'Dedicated PersistentVolumeClaim per ordinal (`data-db-0`).',
        verdict: 'StatefulSet guarantees pod re-attaches to its exact same disk volume.'
      },
      {
        dimension: 'Scaling Behavior',
        optionA: 'Parallel creation and termination in any random order.',
        optionB: 'Strict sequential creation (0 -> 1 -> 2) and reverse termination (2 -> 1 -> 0).',
        verdict: 'Deployments win for rapid autoscaling of web servers.'
      }
    ]
  },
  exercises: {
    quickRevision: [
      'Containers are Linux processes isolated by Namespaces and resource-capped by Cgroups.',
      'A Pod encapsulates co-located containers; Deployments manage rolling updates of ReplicaSets.',
      'Services provide stable virtual IPs and DNS names routed by kube-proxy iptables/IPVS.',
      'StatefulSets provide stable ordinal network identities and dedicated persistent volume claims.',
      'The Kubernetes control plane uses continuous reconciliation loops to align actual state with desired state.'
    ],
    conceptualQuestions: [
      {
        id: 'q9-1',
        question: 'What is the difference between resource "requests" and "limits" in Kubernetes?',
        answer: 'Resource "requests" define the minimum guaranteed amount of CPU and memory a container needs; the scheduler uses requests to find a node with enough capacity. Resource "limits" define the hard maximum ceiling; if a container exceeds its memory limit, it is killed (OOMKilled); if it exceeds its CPU limit, it is throttled.'
      },
      {
        id: 'q9-2',
        question: 'What is the role of an Ingress Controller (e.g., NGINX Ingress, Traefik)?',
        answer: 'An Ingress Controller acts as the L7 reverse proxy and API Gateway for the cluster. It intercepts external HTTP/HTTPS traffic, terminates TLS, and routes requests to internal ClusterIP services based on hostnames and URL paths.'
      },
      {
        id: 'q9-3',
        question: 'What is Horizontal Pod Autoscaler (HPA) and how does it scale workloads?',
        answer: 'HPA queries the Kubernetes Metrics Server every 15 seconds. If average CPU or memory utilization exceeds a configured target (e.g., 75%), HPA recalculates desired replicas: `ceil(current_replicas * (current_metric / target_metric))` and updates the Deployment replica count.'
      }
    ],
    designExercises: [
      {
        id: 'de9-1',
        scenario: 'A high-traffic e-commerce checkout service experiences 5-second traffic spikes during marketing notifications. Pod autoscaling takes 90 seconds to launch new nodes and containers.',
        task: 'Design a rapid scaling strategy in Kubernetes.',
        solutionGuide: '1. Configure HPA with aggressive scale-up behavior: `scaleUp: stabilizationWindowSeconds: 0, selectPolicy: Max, policies: [{type: Percent, value: 100, periodSeconds: 15}]`. 2. Deploy "Balloon Pods" (low-priority dummy pause pods requesting large CPU/memory). When high-priority checkout pods scale, Kubernetes instantly evicts the balloon pods, scheduling checkout pods onto pre-warmed nodes in seconds while the cluster autoscaler boots new physical nodes in the background.'
      }
    ],
    interviewQuestions: [
      {
        id: 'iq9-1',
        question: 'How do you achieve true zero-downtime rolling updates in Kubernetes?',
        answer: 'You must configure five interlocking settings: (1) Multiple replicas (minimum 2 or 3); (2) Deployment rolling update strategy with `maxUnavailable: 0` and `maxSurge: 1`; (3) A robust Readiness Probe so new pods only receive traffic once initialized; (4) Graceful shutdown in application code handling `SIGTERM` and completing in-flight requests; (5) A `preStop` lifecycle hook with a 5-10 second sleep (`sleep 5`) to give kube-proxy and Ingress controllers time to remove the terminating pod from iptables routing tables before the app stops listening.'
      }
    ],
    practicalTask: {
      title: 'Calculate Cluster Capacity and Pod Schedulability',
      instructions: 'A Kubernetes worker node has 16 vCPUs and 64 GB RAM. System daemons (kubelet, OS) reserve 2 vCPUs and 8 GB RAM. If each application pod requests 500m vCPU and 2 GB RAM, calculate the maximum number of pods that can be scheduled onto this node.',
      verification: 'Available CPU = 16 - 2 = 14 vCPUs (14,000m). Pods by CPU = 14,000m / 500m = 28 pods. Available RAM = 64 - 8 = 56 GB. Pods by RAM = 56 GB / 2 GB = 28 pods. Therefore, exactly 28 pods can be scheduled onto this node before it runs out of allocatable resources.'
    }
  },
  sources: [
    {
      title: 'Kubernetes Official Documentation: Architecture & Primitives',
      url: 'https://kubernetes.io/docs/concepts/architecture/',
      type: 'Official Documentation',
      whatItSupports: 'Control plane architecture, worker nodes, controllers, and reconciliation mechanics.'
    }
  ],
  videos: [
    {
      title: 'Large-scale cluster management at Google with Borg',
      creator: 'ACM / Google (John Wilkes)',
      duration: '45m',
      difficulty: 'Advanced',
      whatYouWillLearn: 'The precursor to Kubernetes: Google Borg architecture, scheduling, container isolation, and node management.',
      url: 'https://www.youtube.com/watch?v=gXxOxemocdQ'
    }
  ]
};

export const PART10_CHAPTER: Chapter = {
  id: 'part10-cloud',
  part: 10,
  partTitle: 'Part 10 — Cloud Architecture & Resilient Infrastructure',
  chapterNumber: 10,
  title: 'Cloud Architecture: Multi-AZ, VPCs & Zero-Trust IAM',
  subtitle: 'Regions, Availability Zones, VPC Subnetting, Transit Gateways, IAM Policies & Disaster Recovery',
  summary: 'Cloud providers (AWS, GCP, Azure) provide virtually unlimited elastic infrastructure primitives. Architecting robust production systems requires understanding physical cloud geography, secure network isolation via private subnets, principle of least privilege IAM policies, and automated multi-zone fault domains.',
  diagramAscii: `
+--------------------------------------------------------------------------------------------------+
|                    HIGHLY AVAILABLE MULTI-AZ AWS VPC TOPOLOGY                                    |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   AWS REGION: us-east-1 (N. Virginia)                                                            |
|   VPC: 10.0.0.0/16 [ Internet Gateway (IGW) ]                                                    |
|                                                                                                  |
|   AVAILABILITY ZONE A (us-east-1a)                 AVAILABILITY ZONE B (us-east-1b)               |
|   +---------------------------------------+       +---------------------------------------+      |
|   | PUBLIC SUBNET (10.0.1.0/24)           |       | PUBLIC SUBNET (10.0.2.0/24)           |      |
|   | - Application Load Balancer (ALB)     | <---> | - Application Load Balancer (ALB)     |      |
|   | - NAT Gateway A                       |       | - NAT Gateway B                       |      |
|   +---------------------------------------+       +---------------------------------------+      |
|          |                                               |                                       |
|          v                                               v                                       |
|   +---------------------------------------+       +---------------------------------------+      |
|   | PRIVATE APP SUBNET (10.0.10.0/24)     |       | PRIVATE APP SUBNET (10.0.20.0/24)     |      |
|   | - ECS / EKS App Worker Pods           | <---> | - ECS / EKS App Worker Pods           |      |
|   | - Outbound Internet via NAT Gateway A |       | - Outbound Internet via NAT Gateway B |      |
|   +---------------------------------------+       +---------------------------------------+      |
|          |                                               |                                       |
|          v                                               v                                       |
|   +---------------------------------------+       +---------------------------------------+      |
|   | ISOLATED DB SUBNET (10.0.100.0/24)    |       | ISOLATED DB SUBNET (10.0.200.0/24)    |      |
|   | - RDS PostgreSQL PRIMARY (Writer)     | ===== | - RDS PostgreSQL STANDBY (Sync)       |      |
|   | - Zero Internet Access (No Route)     |  WAL  | - Automatic 60s Failover              |      |
|   +---------------------------------------+       +---------------------------------------+      |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
`,
  concepts: [
    {
      title: 'Cloud Topography: Regions, Availability Zones & Edge POPs',
      confidence: 'stable',
      simpleDefinition: 'A Region is a separate geographic area (e.g., Ireland, Oregon); an Availability Zone (AZ) is one or more isolated physical datacenters within a region; an Edge POP is a point-of-presence for low-latency CDN caching.',
      whyItExists: 'Datacenters experience power outages, floods, and fiber cuts. Deploying across multiple AZs guarantees continuous uptime even if an entire physical building goes dark.',
      analogy: 'An AZ is a separate building in the city with independent power generators and water feeds. A Region is a completely different city 1,000 miles away. An Edge POP is a local neighborhood ATM.',
      technicalExplanation: 'Availability Zones in the same region are physically separated by meaningful distance (typically 10-100 km) to prevent correlated disaster impact (floods, tornados), but connected via ultra-low latency private fiber (< 1-2ms round-trip). This enables synchronous replication between database primary and standby instances. Regions are completely isolated from each other; cross-region communication traverses the public internet or private provider backbones with 50-100ms speed-of-light latency.',
      example: 'AWS `us-east-1` contains 6 distinct Availability Zones. Deploying an RDS database with Multi-AZ automatically replicates writes synchronously to a standby in a different AZ.',
      whenToUse: ['Always deploy production services across at least 2 (preferably 3) Availability Zones within a region.'],
      whenNotToUse: ['Do not run multi-region active-active databases unless strict international data compliance or sub-minute disaster recovery mandates it (it adds immense operational complexity).'],
      commonMistakes: [
        'Assuming AZ names (`us-east-1a`) map to the exact same physical buildings across different AWS accounts: AWS randomizes AZ letter mappings per account to distribute hardware load evenly. Use AZ IDs (`use1-az1`) to compare physical locations.'
      ],
      interviewQuestion: {
        question: 'Why is synchronous database replication viable across Availability Zones but infeasible across Regions?',
        answer: 'Availability Zones within a single region are connected by redundant, high-bandwidth dark fiber with round-trip latency of under 1 to 2 milliseconds. A database transaction waiting for a synchronous commit acknowledgment from a replica in another AZ only adds ~1ms to user write latency. In contrast, cross-region replication (e.g., New York to Frankfurt) has a physical speed-of-light round-trip latency of 70ms to 90ms. Waiting for cross-region synchronous commits on every write slows transactional throughput to a crawl.'
      }
    },
    {
      title: 'VPC Architecture & Subnet Segmentation',
      confidence: 'stable',
      simpleDefinition: 'A Virtual Private Cloud (VPC) is your isolated virtual network in the cloud; subnets segment the network into public, private, and isolated security tiers.',
      whyItExists: 'Placing database servers or backend services directly on public IP addresses invites automated port scanning, ransomware, and brute force attacks.',
      analogy: 'A secure corporate office: the lobby is public (Public Subnet, where visitors arrive); employee desks are private (Private Subnet, requires badge); the bank vault is isolated (Isolated Subnet, zero doors to the street, only accessible from inside).',
      technicalExplanation: 'A VPC is assigned a CIDR block (e.g., `10.0.0.0/16` = 65,536 IPs). Architecture tiers: (1) Public Subnets: Route table points `0.0.0.0/0` to an Internet Gateway (IGW). Hosts have public IPs (ALB, Bastion hosts, NAT Gateways). (2) Private Application Subnets: Route table points `0.0.0.0/0` to a NAT Gateway located in the public subnet. Pods can initiate outbound internet requests (to download packages or call Stripe API) but cannot receive inbound connections from the internet. (3) Isolated Database Subnets: No route to the internet whatsoever (`0.0.0.0/0` is unrouted). Only accessible from Private App Subnets via Security Groups.',
      example: 'In an AWS architecture: The Application Load Balancer lives in the Public Subnets. Microservice ECS tasks live in the Private Subnets. Aurora PostgreSQL lives in the Isolated Database Subnets.',
      whenToUse: ['Mandatory three-tier VPC segmentation for all enterprise production environments.'],
      whenNotToUse: ['Do not assign public IP addresses to database instances, cache nodes, or internal microservices.'],
      commonMistakes: [
        'Deploying only one NAT Gateway for a multi-AZ cluster: if AZ-A crashes, all private subnets across all AZs lose outbound internet connectivity. Always deploy one NAT Gateway per AZ.'
      ],
      interviewQuestion: {
        question: 'What is the difference between a Security Group and a Network Access Control List (NACL) in AWS VPC networking?',
        answer: 'Security Groups operate at the instance/ENI level, are stateful (if inbound traffic is permitted, outbound response is automatically allowed regardless of outbound rules), and only support ALLOW rules. NACLs operate at the subnet boundary, are stateless (inbound and outbound traffic must be explicitly permitted with matching rules), and evaluate sequential numbered rules supporting both ALLOW and DENY rules. Security Groups are the primary defense; NACLs act as a subnet-wide firewall.'
      }
    },
    {
      title: 'Cloud IAM & Zero-Trust Security Policies',
      confidence: 'stable',
      simpleDefinition: 'Cloud IAM (Identity and Access Management) defines WHO (identities) can perform WHAT actions on WHICH resources under WHAT conditions, governed by the Principle of Least Privilege.',
      whyItExists: 'Over-permissioned credentials are the leading cause of catastrophic cloud breaches. If an attacker compromises a web server with admin permissions, they can wipe the entire company’s cloud account.',
      analogy: 'A hotel keycard that only unlocks your specific room door, only between 3 PM check-in and 11 AM check-out. It does not open any other guest rooms, the manager’s office, or the vault.',
      technicalExplanation: 'IAM components: (1) Principles: Users, Groups, and Roles. (2) Roles & Temporary Credentials: ECS tasks or Kubernetes pods assume IAM Roles via OpenID Connect (IRSA / Workload Identity) to receive temporary 1-hour credentials via STS (Security Token Service), avoiding static API keys in code. (3) Policy Evaluation: Default is implicit DENY. An explicit DENY always overrides any ALLOW. Policies specify: `Effect: "Allow"`, `Action: ["s3:GetObject"]`, `Resource: "arn:aws:s3:::tenant-bucket/*"`, with `Condition` blocks enforcing IP limits, MFA, or tag boundaries.',
      example: 'A document processing worker assumes an IAM role permitting only `s3:GetObject` on `arn:aws:s3:::uploads/*` and `sqs:ReceiveMessage` on the upload queue. It has zero permissions to read database credentials or delete S3 buckets.',
      whenToUse: ['Always use IAM Roles with Workload Identity / IRSA for applications; never hardcode AWS Access Keys (`AKIA...`) in config files or environment variables.'],
      whenNotToUse: ['Never attach the `AdministratorAccess` policy to an application runtime role.'],
      commonMistakes: [
        'Using wildcard actions: `Action: "s3:*"` allows malicious actors who exploit an SSRF vulnerability to dump, overwrite, and delete every bucket in the organization.'
      ],
      interviewQuestion: {
        question: 'How do Kubernetes pods securely access AWS resources without static AWS API keys?',
        answer: 'Using IAM Roles for Service Accounts (IRSA): (1) The EKS cluster creates an OpenID Connect (OIDC) identity provider. (2) You create an AWS IAM Role with a trust policy that trusts the OIDC provider and the specific Kubernetes ServiceAccount (`system:serviceaccount:ns:name`). (3) The Kubernetes pod is annotated with the IAM role ARN. (4) When the pod boots, the EKS Pod Identity Webhook injects an OIDC token and AWS SDK environment variables. (5) The AWS SDK calls `sts:AssumeRoleWithWebIdentity` to exchange the pod token for temporary 1-hour AWS STS credentials.'
      }
    }
  ],
  tradeOffAnalysis: {
    technologyA: 'Multi-AZ High Availability (Single Region)',
    technologyB: 'Multi-Region Active-Active Deployment',
    comparisonDimensions: [
      {
        dimension: 'Failover RTO',
        optionA: 'Fast automated failover (30-60 seconds for DB election).',
        optionB: 'Near-instant (traffic shifted at DNS / Anycast level).',
        verdict: 'Multi-Region wins for zero-interruption business continuity.'
      },
      {
        dimension: 'Cost & Operational Complexity',
        optionA: 'Standard. Single VPC topology, low cross-AZ bandwidth fees.',
        optionB: 'Massive. Duplicated clusters, cross-region replication fees, conflict resolution.',
        verdict: 'Multi-AZ is vastly more cost-effective for 99% of SaaS businesses.'
      },
      {
        dimension: 'Data Consistency',
        optionA: 'Strong consistency via synchronous cross-AZ replication.',
        optionB: 'Eventual consistency required to avoid speed-of-light latency penalties.',
        verdict: 'Multi-AZ wins for core transactional ledgers.'
      }
    ]
  },
  exercises: {
    quickRevision: [
      'Multi-AZ deployments protect against datacenter hardware disasters via low-latency synchronous links.',
      'Three-tier VPCs isolate workloads into Public (ALB), Private (App Pods), and Isolated (Databases) subnets.',
      'Never assign public IPs to backend databases or internal application services.',
      'Use IAM Roles with temporary STS credentials (IRSA); never commit static cloud API keys.',
      'Explicit DENY always overrides any ALLOW in cloud IAM policy evaluation engines.'
    ],
    conceptualQuestions: [
      {
        id: 'q10-1',
        question: 'What is a VPC Peering connection versus an AWS Transit Gateway?',
        answer: 'VPC Peering connects two VPCs point-to-point (non-transitive; connecting 10 VPCs requires 45 individual peering links). AWS Transit Gateway acts as a central regional cloud router (hub-and-spoke) connecting hundreds of VPCs and on-premises networks with centralized routing tables.'
      },
      {
        id: 'q10-2',
        question: 'What is an AWS PrivateLink (VPC Endpoint) and why is it used?',
        answer: 'PrivateLink establishes private network connectivity from your VPC to AWS services (S3, SQS, DynamoDB) or third-party SaaS vendors over the private AWS backbone, completely bypassing the public internet and eliminating NAT Gateway data processing fees.'
      },
      {
        id: 'q10-3',
        question: 'What is the shared responsibility model in cloud security?',
        answer: 'The cloud provider is responsible for "Security OF the Cloud" (physical datacenters, hardware, virtualization hypervisors, network infrastructure). The customer is responsible for "Security IN the Cloud" (customer data, IAM credentials, OS patches, network firewall configuration, encryption).'
      }
    ],
    designExercises: [
      {
        id: 'de10-1',
        scenario: 'A fintech banking startup needs to deploy a payment processing backend on AWS that complies with PCI-DSS network segmentation requirements.',
        task: 'Design the VPC CIDR allocation, subnet layout, and internet access controls.',
        solutionGuide: 'Provision VPC `10.100.0.0/16` across 3 AZs. Create: 3 Public Subnets (`10.100.1.0/24`, `10.100.2.0/24`, `10.100.3.0/24`) housing only AWS ALBs and NAT Gateways. Create 3 Private App Subnets (`10.100.10.0/24`, `10.100.20.0/24`, `10.100.30.0/24`) for EKS payment pods routing outbound to NAT Gateways. Create 3 Isolated Database Subnets (`10.100.100.0/24`, `10.100.200.0/24`, `10.100.250.0/24`) for Aurora PostgreSQL with zero internet routes. Enforce Security Group chaining: DB accepts inbound port 5432 strictly from App Security Group ID.'
      }
    ],
    interviewQuestions: [
      {
        id: 'iq10-1',
        question: 'How do you design a disaster recovery strategy with an RPO of 5 minutes and an RTO of 15 minutes across AWS regions?',
        answer: 'Implement a "Warm Standby" multi-region architecture: (1) Primary region (us-east-1) runs full active production traffic; (2) Secondary region (us-west-2) runs a minimal scaled-down footprint of application containers behind an ALB; (3) Aurora Global Database replicates data from Primary to Secondary asynchronously with sub-second replication lag (satisfies RPO < 5 mins); (4) Amazon Route 53 Health Checks monitor primary region endpoints; (5) On disaster declaration, Route 53 shifts DNS traffic to secondary region, Aurora Global Database promotes secondary to writer (takes ~1 minute), and Kubernetes HPA rapidly scales container pods to full capacity (takes ~5-10 minutes, satisfying RTO < 15 mins).'
      }
    ],
    practicalTask: {
      title: 'Calculate IP Address Availability in CIDR Subnets',
      instructions: 'Given a VPC CIDR `10.0.0.0/24` divided into two `/25` subnets: calculate the total number of theoretical IP addresses and the number of usable IP addresses for host allocation in AWS.',
      verification: 'A `/25` subnet has `2^(32-25) = 2^7 = 128` theoretical IP addresses. However, AWS reserves 5 IP addresses in every subnet: .0 (Network address), .1 (VPC router), .2 (DNS resolver), .3 (Future use), and .255 (Broadcast address). Therefore, exactly `128 - 5 = 123` IP addresses are usable per `/25` subnet.'
    }
  },
  sources: [
    {
      title: 'AWS Well-Architected Framework: Reliability Pillar',
      url: 'https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html',
      type: 'Official Documentation',
      whatItSupports: 'Fault isolation, multi-AZ design, disaster recovery strategies, and capacity planning.'
    }
  ],
  videos: [
    {
      title: 'AWS re:Invent 2022 - Advanced VPC design and architectures (NET303)',
      creator: 'AWS Events',
      duration: '58m',
      difficulty: 'Advanced',
      whatYouWillLearn: 'Complex multi-VPC topologies, Transit Gateway routing, PrivateLink, and multi-region hybrid networking.',
      url: 'https://www.youtube.com/watch?v=fpxlQ_BghmY'
    }
  ]
};

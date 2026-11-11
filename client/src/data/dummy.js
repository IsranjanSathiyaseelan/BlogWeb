/**
 * dummy.js
 * 
 * 10 realistic dummy IT-related blog stories.
 * Stored purely client-side — not persisted in database or backend.
 * Distinguishable via `isDummy: true` flag.
 */

export const dummyStories = [
  {
    id: 9001,
    title: "Architecting Modern LLM Applications: From Prompt Engineering to RAG Pipelines",
    slug: "architecting-modern-llm-applications-rag-pipelines",
    excerpt: "A practical engineering guide to building resilient retrieval-augmented generation systems, evaluating vector similarity, and mitigating hallucinations in production.",
    category: "Artificial Intelligence and Machine Learning",
    author: "Dr. Elena Rostova",
    authorEmail: "elena.rostova@techresearch.io",
    publishedAt: "2025-01-14",
    publishedDate: "2025-01-14",
    readMinutes: 8,
    readingTime: "8 min read",
    keywords: [
      "Artificial Intelligence",
      "Machine Learning",
      "LLM",
      "RAG",
      "Vector Database",
      "Embeddings",
      "LangChain",
      "Semantic Search"
    ],
    featured: true,
    isDummy: true,
    content: [
      "## The Shift From Pure Prompting to Retrieval-Augmented Generation",
      "While large language models (LLMs) continue to demonstrate remarkable generative prowess, their static pre-training weights inherently lack contextual awareness of private proprietary data. Relying purely on system prompt engineering quickly hits context-window ceilings and introduces hallucinations.",
      "Retrieval-Augmented Generation (RAG) bridges this gap by decoupling parametric knowledge from non-parametric retrieval. In a production pipeline, queries are transformed into dense vector embeddings and queried against a specialized vector index before prompting the generative foundation model.",
      "```python\nfrom langchain_community.vectorstores import Chroma\nfrom langchain_openai import OpenAIEmbeddings\n\n# Initialize vector retriever\nembedding_engine = OpenAIEmbeddings(model='text-embedding-3-small')\nvector_store = Chroma(persist_directory='./vector_db', embedding_function=embedding_engine)\nretriever = vector_store.as_retriever(search_type='similarity', search_kwargs={'k': 4})\n```",
      "## Overcoming Chunking and Context Fragmentation",
      "Chunking strategy directly dictates the signal-to-noise ratio in semantic retrieval. Naive sliding window chunking frequently breaks semantic paragraphs in half, resulting in poor retrieval scores.",
      "> Effective semantic chunking groups document tokens based on structural boundaries like Markdown headers, sentences, or syntax blocks rather than arbitrary byte counts.",
      "- **Hierarchical Chunking:** Retain parent document metadata while embedding smaller leaf nodes for precise cosine distance calculation.",
      "- **Hybrid Keyword and Vector Search:** Combine BM25 probabilistic relevance with dense embeddings to handle rare product codes and acronyms.",
      "- **Reranking Layers:** Employ cross-encoder rerankers to re-score candidate chunks before passing them to the final context window."
    ]
  },
  {
    id: 9002,
    title: "The Evolution of Web Rendering: Islands Architecture and Edge Compute",
    slug: "evolution-of-web-rendering-islands-architecture-edge-compute",
    excerpt: "How partial hydration and edge-rendered server components are solving long-standing bundle size bottlenecks and delivering sub-second Largest Contentful Paint.",
    category: "Web Development",
    author: "Marcus Vance",
    authorEmail: "marcus.vance@webfrontier.dev",
    publishedAt: "2025-01-22",
    publishedDate: "2025-01-22",
    readMinutes: 6,
    readingTime: "6 min read",
    keywords: [
      "Web Development",
      "Islands Architecture",
      "Edge Compute",
      "SSR",
      "Partial Hydration",
      "Core Web Vitals",
      "Performance"
    ],
    featured: false,
    isDummy: true,
    content: [
      "## Beyond Single-Page Application Monoliths",
      "For over a decade, client-side rendering (CSR) dominated modern frontend architecture. However, shipping multi-megabyte JavaScript bundles to mobile devices over constrained cellular networks created severe First Input Delay (FID) and Interaction to Next Paint (INP) degradation.",
      "Islands Architecture fundamentally changes this paradigm by rendering pure HTML on the server by default and selectively hydrating isolated interactive widgets — the 'islands' in a sea of static markup.",
      "```html\n<!-- Static HTML rendered at the edge -->\n<header class='site-nav'>...</header>\n<main>\n  <article class='content'>...</article>\n  <!-- Interactive Island hydrated independently -->\n  <interactive-comment-box client:visible></interactive-comment-box>\n</main>\n```",
      "## Edge Workers and Zero-Cold-Start Routing",
      "By distributing serverless execution across geographically localized edge nodes (such as Cloudflare Workers or Vercel Edge Runtime), dynamic pages render in single-digit milliseconds.",
      "> Pushing templating logic to the edge combines the instantaneous performance of static CDNs with the personalization of centralized origin servers."
    ]
  },
  {
    id: 9003,
    title: "Mastering React 19: Server Actions, Optimistic UI, and the Compiler",
    slug: "mastering-react-19-server-actions-optimistic-ui-compiler",
    excerpt: "Deep dive into React 19 features including automatic memoization with the React Compiler, seamless mutation workflows with Server Actions, and instant feedback via useOptimistic.",
    category: "React and JavaScript",
    author: "Sarah Jenkins",
    authorEmail: "sarah.j@reactpulse.com",
    publishedAt: "2025-02-03",
    publishedDate: "2025-02-03",
    readMinutes: 7,
    readingTime: "7 min read",
    keywords: [
      "React and JavaScript",
      "React 19",
      "JavaScript",
      "Server Actions",
      "useOptimistic",
      "React Compiler",
      "Hooks",
      "Frontend"
    ],
    featured: false,
    isDummy: true,
    content: [
      "## The End of Manual useMemo and useCallback",
      "One of the most transformative updates in React 19 is the React Compiler (formerly React Forget). By operating at the Babel and AST level, the compiler automatically memorizes component subtrees and computation values without requiring developers to micromanage dependency arrays.",
      "## Declarative Form Mutations With Server Actions",
      "Handling asynchronous form submissions traditionally required cumbersome boilerplate with state variables, `onSubmit` prevent-default handlers, and manual loading indicators. Server Actions streamline this into standard form attributes.",
      "```tsx\nimport { useActionState, useOptimistic } from 'react';\n\nfunction CommentForm({ addCommentAction, currentComments }) {\n  const [optimisticList, setOptimistic] = useOptimistic(\n    currentComments,\n    (state, newText) => [...state, { text: newText, pending: true }]\n  );\n\n  return (\n    <form action={async (formData) => {\n      const text = formData.get('comment');\n      setOptimistic(text);\n      await addCommentAction(formData);\n    }}>\n      <input name='comment' required />\n      <button type='submit'>Post Comment</button>\n    </form>\n  );\n}\n```",
      "## Optimistic State for Instantaneous Perceived Latency",
      "Using `useOptimistic`, interfaces immediately render the expected final state of an operation while the background HTTP transaction is still in flight, reverting smoothly if the network request fails."
    ]
  },
  {
    id: 9004,
    title: "Zero Trust Security in Cloud Native Environments: Beyond the Perimeter",
    slug: "zero-trust-security-cloud-native-environments",
    excerpt: "Deconstructing micro-segmentation, mutual TLS identity verification, and runtime security postures for distributed microservice clusters.",
    category: "Cybersecurity",
    author: "Aiden Thorne",
    authorEmail: "a.thorne@infosec-defense.org",
    publishedAt: "2025-02-11",
    publishedDate: "2025-02-11",
    readMinutes: 9,
    readingTime: "9 min read",
    keywords: [
      "Cybersecurity",
      "Zero Trust",
      "mTLS",
      "Identity",
      "Cloud Security",
      "Vulnerability Management",
      "SPIFFE",
      "Service Mesh"
    ],
    featured: false,
    isDummy: true,
    content: [
      "## The Fallacy of the Perimeter Defense",
      "Traditional enterprise cybersecurity relied heavily on castle-and-moat models: once an entity crossed the firewall, internal traffic enjoyed broad implicit trust. In modern containerized Kubernetes clusters running across ephemeral pods, this premise is fatal.",
      "> Zero Trust enforces a strict operational doctrine: 'Never trust, always verify.' Every request—whether inter-service or ingress—must be authenticated, authorized, and encrypted.",
      "## Cryptographic Workload Identity with SPIFFE / SPIRE",
      "Rather than relying on brittle IP address whitelists or long-lived shared tokens, microservices should acquire short-lived cryptographic X.509 certificates verified through mutual TLS (mTLS).",
      "- **Automated Key Rotation:** Certificates expire in hours rather than months, mitigating credential leakage risk.",
      "- **Granular Service Authorization:** Network policies restrict traffic strictly between approved service identities.",
      "- **Runtime Security Monitoring:** Real-time eBPF kernel probes detect unauthorized syscalls, abnormal child processes, and reverse shells instantaneously."
    ]
  },
  {
    id: 9005,
    title: "Multi-Cloud Kubernetes Orchestration: Resiliency, FinOps, and Traffic Routing",
    slug: "multi-cloud-kubernetes-orchestration-resiliency-finops",
    excerpt: "Patterns and anti-patterns when deploying multi-region distributed workloads across major cloud providers while managing egress expenses and telemetry.",
    category: "Cloud Computing",
    author: "Priya Sharma",
    authorEmail: "priya.sharma@cloudarchitects.io",
    publishedAt: "2025-02-18",
    publishedDate: "2025-02-18",
    readMinutes: 8,
    readingTime: "8 min read",
    keywords: [
      "Cloud Computing",
      "Kubernetes",
      "AWS",
      "GCP",
      "FinOps",
      "Multi-Cloud",
      "Infrastructure",
      "Terraform"
    ],
    featured: false,
    isDummy: true,
    content: [
      "## Strategic Multi-Cloud vs. Accidental Multi-Cloud",
      "Organizations frequently pursue multi-cloud architectures to avoid vendor lock-in and adhere to jurisdictional data residency regulations. However, treating cloud providers as interchangeable commodities often yields the lowest common denominator of functionality.",
      "```yaml\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: global-traffic-router\n  annotations:\n    ingress.class: multi-cluster-gateway\nspec:\n  rules:\n  - host: api.enterprise.global\n    http:\n      paths:\n      - path: /v1\n        backend:\n          service:\n            name: orders-service\n            port:\n              number: 8080\n```",
      "## FinOps and the Realities of Data Egress",
      "Cross-cloud networking introduces significant financial overhead if architectural boundaries are drawn carelessly. Keeping data processing adjacent to primary storage buckets prevents unexpected compounding bandwidth invoices.",
      "> High availability across cloud providers requires active-passive disaster recovery pairing or state synchronization via globally distributed databases like CockroachDB or Google Cloud Spanner."
    ]
  },
  {
    id: 9006,
    title: "Domain-Driven Design in Event-Driven Microservices: Tactical Patterns",
    slug: "domain-driven-design-event-driven-microservices",
    excerpt: "Applying bounded contexts, aggregates, and transactional outbox patterns to guarantee consistency across asynchronous distributed event streams.",
    category: "Software Engineering",
    author: "David Kim",
    authorEmail: "dkim@softwarecraftsmanship.net",
    publishedAt: "2025-02-27",
    publishedDate: "2025-02-27",
    readMinutes: 10,
    readingTime: "10 min read",
    keywords: [
      "Software Engineering",
      "Domain-Driven Design",
      "Microservices",
      "Event-Driven",
      "CQRS",
      "Architecture",
      "Kafka"
    ],
    featured: false,
    isDummy: true,
    content: [
      "## Defining Rigid Bounded Contexts",
      "Microservice boundaries should not be designed around database tables or user interface views. Domain-Driven Design (DDD) provides tactical and strategic tools to discover true bounded contexts based on ubiquitous language and operational invariants.",
      "```typescript\n// Aggregate Root encapsulating domain invariants\nexport class OrderAggregate {\n  private state: 'DRAFT' | 'CONFIRMED' | 'FULFILLED' = 'DRAFT';\n\n  public confirmOrder(paymentToken: string): DomainEvent {\n    if (this.state !== 'DRAFT') {\n      throw new Error('Only draft orders can be confirmed.');\n    }\n    this.state = 'CONFIRMED';\n    return new OrderConfirmedEvent(this.id, paymentToken);\n  }\n}\n```",
      "## The Transactional Outbox Pattern",
      "Publishing domain events directly to message brokers during database write transactions exposes systems to dual-write failures. If the message broker is unreachable immediately following a database commit, consumers miss updates.",
      "- **Outbox Table:** Persist domain events in an outbox table within the exact same atomic database transaction as the entity state change.",
      "- **CDC Debezium Processors:** Stream write-ahead log (WAL) changes directly into Apache Kafka without double-dispatch risks."
    ]
  },
  {
    id: 9007,
    title: "Feature Engineering at Scale: Real-Time Stream Processing and Vector Stores",
    slug: "feature-engineering-at-scale-real-time-stream-processing",
    excerpt: "How modern data teams build low-latency feature stores bridging offline training pipelines with millisecond online prediction serving.",
    category: "Data Science",
    author: "Chloe Dubois",
    authorEmail: "chloe.dubois@datascience-insights.org",
    publishedAt: "2025-03-05",
    publishedDate: "2025-03-05",
    readMinutes: 7,
    readingTime: "7 min read",
    keywords: [
      "Data Science",
      "Feature Store",
      "Machine Learning",
      "Stream Processing",
      "Apache Kafka",
      "Analytics",
      "Python"
    ],
    featured: false,
    isDummy: true,
    content: [
      "## The Training-Serving Skew Dilemma",
      "A primary failure mode in machine learning systems is training-serving skew: when features calculated during offline batch model training diverge in semantics or calculation methods from features evaluated in production serving APIs.",
      "Modern feature stores like Feast or Hopsworks solve this by maintaining unified feature definitions shared across offline data warehouses (Snowflake, BigQuery) and low-latency online key-value stores (Redis, DynamoDB).",
      "```python\n# Feature view definition with Feast\nfrom feast import Entity, FeatureView, Field, Int64, Float32\nfrom datetime import timedelta\n\nuser_entity = Entity(name='user_id', value_type=Int64)\n\nuser_order_stats = FeatureView(\n    name='user_order_stats',\n    entities=[user_entity],\n    ttl=timedelta(days=30),\n    schema=[\n        Field(name='avg_order_value', dtype=Float32),\n        Field(name='lifetime_orders', dtype=Int64),\n    ],\n    online=True,\n)\n```",
      "## Real-Time Sliding Window Aggregations",
      "By combining streaming engines like Apache Flink with transactional vector databases, data science platforms compute rolling 10-minute transaction counts and fraud probabilities in under 15 milliseconds."
    ]
  },
  {
    id: 9008,
    title: "High-Performance Python with Asynchronous I/O, uv, and Rust Extensions",
    slug: "high-performance-python-asyncio-uv-rust-extensions",
    excerpt: "Unlocking maximum throughput in Python services using modern package management, non-blocking asynchronous event loops, and compiled PyO3 native extensions.",
    category: "Python Programming",
    author: "Liam O'Connor",
    authorEmail: "liam.oconnor@pythonic-systems.io",
    publishedAt: "2025-03-12",
    publishedDate: "2025-03-12",
    readMinutes: 6,
    readingTime: "6 min read",
    keywords: [
      "Python Programming",
      "AsyncIO",
      "Rust",
      "PyO3",
      "uv",
      "Performance",
      "Concurrency",
      "FastAPI"
    ],
    featured: false,
    isDummy: true,
    content: [
      "## The Modern Python Toolchain Renaissance",
      "Python tooling has undergone a revolution over the past two years. With Astral's `uv`, virtual environment creation, package resolution, and dependency installations happen in tenths of a second thanks to unified Rust-powered execution.",
      "## Eliminating CPU Bottlenecks with PyO3",
      "While Python's asynchronous event loop (`asyncio`) excels at high-concurrency network I/O, compute-heavy algorithms (such as cryptographic hashing or dense matrix math) still stall the Global Interpreter Lock (GIL).",
      "```rust\n// Rust native extension using PyO3\nuse pyo3::prelude::*;\n\n#[pyfunction]\nfn fast_hamming_distance(a: &str, b: &str) -> PyResult<usize> {\n    Ok(a.chars().zip(b.chars()).filter(|(x, y)| x != y).count())\n}\n\n#[pymodule]\nfn rust_accelerator(_py: Python, m: &PyModule) -> PyResult<()> {\n    m.add_function(wrap_pyfunction!(fast_hamming_distance, m)?)?;\n    Ok(())\n}\n```",
      "> Writing performance-critical inner loops in Rust via PyO3 grants Python services native C-level execution speeds while preserving pleasant, expressive Python ergonomics."
    ]
  },
  {
    id: 9009,
    title: "Next-Gen CI/CD: Ephemeral Environments, GitOps, and AI-Assisted Rollbacks",
    slug: "next-gen-cicd-ephemeral-environments-gitops",
    excerpt: "How declarative GitOps workflows paired with automated canary analysis minimize deployment risk and eliminate production maintenance windows.",
    category: "DevOps and Automation",
    author: "Tariq Mansoor",
    authorEmail: "tariq.m@devops-frontier.com",
    publishedAt: "2025-03-20",
    publishedDate: "2025-03-20",
    readMinutes: 8,
    readingTime: "8 min read",
    keywords: [
      "DevOps and Automation",
      "GitOps",
      "CI/CD",
      "ArgoCD",
      "Automation",
      "Terraform",
      "Docker",
      "Canary Deployments"
    ],
    featured: false,
    isDummy: true,
    content: [
      "## Ephemeral Preview Environments for Every Pull Request",
      "Staging environments frequently become bottlenecked dumping grounds where untested dependencies collide. Progressive engineering organizations now provision ephemeral Kubernetes namespaces on-demand for every pull request, seeded with anonymized database fixtures.",
      "## GitOps as the Single Source of Truth",
      "With tools like ArgoCD and Flux, configuration drift is eradicated. Pull requests merge declarative Kubernetes manifests directly to Git; reconciliation controllers sync cluster state automatically without exposing cluster admin credentials to external CI runners.",
      "```yaml\napiVersion: argoproj.io/v1alpha1\nkind: Application\nmetadata:\n  name: production-microservices\nspec:\n  project: default\n  source:\n    repoURL: https://github.com/org/gitops-manifests.git\n    targetRevision: HEAD\n    path: environments/production\n  destination:\n    server: https://kubernetes.default.svc\n    namespace: production\n  syncPolicy:\n    automated:\n      prune: true\n      selfHeal: true\n```",
      "- **Automated Canary Analysis:** Route 5% of production traffic to canary pods while telemetry monitors HTTP 5xx error spikes.",
      "- **Instantaneous Automated Rollbacks:** Revert Git commit references automatically if p99 latency degrades by more than 10% during deployment."
    ]
  },
  {
    id: 9010,
    title: "Quantum Computing and Post-Quantum Cryptography: Preparing Production Stacks",
    slug: "quantum-computing-post-quantum-cryptography-production",
    excerpt: "An exploration of quantum advantage milestones, lattice-based cryptography standards, and migration roadmaps for securing TLS handshakes today.",
    category: "Emerging Technologies",
    author: "Dr. Aris Thorne",
    authorEmail: "aris.thorne@quantum-research.edu",
    publishedAt: "2025-03-28",
    publishedDate: "2025-03-28",
    readMinutes: 9,
    readingTime: "9 min read",
    keywords: [
      "Emerging Technologies",
      "Quantum Computing",
      "Cryptography",
      "NIST",
      "Security",
      "Future Tech",
      "Post-Quantum",
      "Qubit"
    ],
    featured: false,
    isDummy: true,
    content: [
      "## The Looming Threat of Shor's Algorithm",
      "Sufficiently scaled fault-tolerant quantum computers will be capable of solving the discrete logarithm problem and integer factorization in polynomial time. This renders RSA and Elliptic Curve Cryptography (ECC)—the foundations of global public-key infrastructure—vulnerable to decryption.",
      "> Adversaries are already engaging in 'Harvest Now, Decrypt Later' operations, capturing encrypted enterprise communications to decrypt once quantum hardware matures.",
      "## NIST Post-Quantum Standards: ML-KEM and ML-DSA",
      "The National Institute of Standards and Technology (NIST) finalized post-quantum cryptographic standards based on hard problems in lattice mathematics, specifically ML-KEM (formerly Kyber) for key encapsulation and ML-DSA (Dilithium) for digital signatures.",
      "- **Hybrid Key Exchange:** Combine classical X25519 with post-quantum ML-KEM in TLS 1.3 handshakes to retain defense-in-depth protection.",
      "- **Cryptographic Agility:** Abstract algorithm selection in codebases so cipher suites can be updated through runtime configuration flags without refactoring."
    ]
  }
];

export default dummyStories;


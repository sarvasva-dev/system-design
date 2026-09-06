import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  AlertOctagon, 
  RefreshCw, 
  ShieldAlert, 
  Sliders, 
  Play, 
  Zap, 
  Activity,
  Globe,
  Database,
  Radio
} from 'lucide-react';

export const MicroservicesDiagram: React.FC = () => {
  const [circuitBreakerState, setCircuitBreakerState] = useState<'closed' | 'open' | 'half_open'>('closed');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('orders');
  const [isTracingRequest, setIsTracingRequest] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const services = [
    {
      id: 'gateway',
      name: 'API Gateway',
      type: 'Ingress Proxy',
      tech: 'Kong / Envoy',
      protocol: 'HTTPS :443 -> gRPC',
      role: 'JWT auth validation, tenant rate limiting, route dispatching.',
      resilience: 'Multi-AZ cluster, active keep-alive pooling'
    },
    {
      id: 'orders',
      name: 'Order Service',
      type: 'Core Domain',
      tech: 'Go 1.22 + Envoy Sidecar',
      protocol: 'gRPC Protobuf :50051',
      role: 'Coordinates checkout transactions, order state machine, cart validation.',
      resilience: 'HPA 3-20 Pods, Graceful drain, idempotency store'
    },
    {
      id: 'payments',
      name: 'Payment Gateway Client',
      type: 'External Integrator',
      tech: 'Rust + Circuit Breaker',
      protocol: 'HTTPS Outbound to Stripe/Adyen',
      role: 'Idempotent card charging, PSP tokenization, webhook ingestion.',
      resilience: 'Circuit Breaker: trips at 50% error rate over 10s'
    },
    {
      id: 'inventory',
      name: 'Inventory Service',
      type: 'Catalog & Stock',
      tech: 'Java 21 + Envoy Sidecar',
      protocol: 'gRPC Protobuf :50052',
      role: 'Atomic stock reservations using distributed Redis mutex locks.',
      resilience: 'Read replicas, local LRU cache of high-velocity SKUs'
    },
    {
      id: 'notifications',
      name: 'Notification Worker',
      type: 'Async Consumer',
      tech: 'Node.js + Kafka Consumer',
      protocol: 'Kafka Event Stream',
      role: 'Sends order confirmation emails, SMS alerts, webhooks.',
      resilience: 'Dead-letter queue (DLQ) with exponential retry backoff'
    }
  ];

  const handleSimulateTrace = () => {
    if (isTracingRequest) return;
    setIsTracingRequest(true);
    setActiveStep(1);

    setTimeout(() => setActiveStep(2), 600);
    setTimeout(() => {
      // If circuit breaker is OPEN, request fails at step 3 with fast fallback!
      if (circuitBreakerState === 'open') {
        setActiveStep(99); // Failed at payment
        setTimeout(() => {
          setIsTracingRequest(false);
          setActiveStep(null);
        }, 1500);
      } else {
        setActiveStep(3);
        setTimeout(() => setActiveStep(4), 600);
        setTimeout(() => {
          setActiveStep(5);
          setTimeout(() => {
            setIsTracingRequest(false);
            setActiveStep(null);
          }, 1000);
        }, 600);
      }
    }, 1200);
  };

  const selectedService = services.find(s => s.id === selectedServiceId) || services[1];

  return (
    <div className="rounded-md border border-[#232634] bg-[#0c0d13] p-4 sm:p-6 lg:p-7 space-y-6 text-[#cbd5e1] font-sans">
      {/* Diagram Top Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1f2230] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xs bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#d4af37]">
              <Cpu className="h-4 w-4" />
            </div>
            <h3 className="text-base sm:text-lg font-serif font-medium text-[#ffffff] flex items-center gap-2">
              Microservices &amp; Service Mesh Architecture
              <span className="text-[9px] uppercase font-mono tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#1b1911] text-[#d4af37] border border-[#d4af37]/30">
                Service Mesh &bull; Envoy
              </span>
            </h3>
          </div>
          <p className="text-xs text-[#94a3b8] mt-1">
            Real-time request choreography across API Gateway, gRPC Envoy sidecars, Circuit Breakers, and Kafka asynchronous decoupling.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Circuit Breaker State Manipulator */}
          <div className="flex items-center gap-1.5 rounded-sm bg-[#141622] p-1 border border-[#232634]">
            <span className="text-[10px] uppercase font-mono text-[#94a3b8] px-1.5">Circuit:</span>
            <button
              onClick={() => setCircuitBreakerState('closed')}
              className={`px-2 py-0.8 text-[11px] font-mono rounded-xs transition-colors cursor-pointer ${
                circuitBreakerState === 'closed'
                  ? 'bg-[#22c55e] text-[#000] font-bold shadow-xs'
                  : 'text-[#94a3b8] hover:text-[#fff]'
              }`}
            >
              Closed (Healthy)
            </button>
            <button
              onClick={() => setCircuitBreakerState('half_open')}
              className={`px-2 py-0.8 text-[11px] font-mono rounded-xs transition-colors cursor-pointer ${
                circuitBreakerState === 'half_open'
                  ? 'bg-[#f59e0b] text-[#000] font-bold shadow-xs'
                  : 'text-[#94a3b8] hover:text-[#fff]'
              }`}
            >
              Half-Open (Canary)
            </button>
            <button
              onClick={() => setCircuitBreakerState('open')}
              className={`px-2 py-0.8 text-[11px] font-mono rounded-xs transition-colors cursor-pointer ${
                circuitBreakerState === 'open'
                  ? 'bg-[#ef4444] text-[#fff] font-bold shadow-xs'
                  : 'text-[#94a3b8] hover:text-[#fff]'
              }`}
            >
              Open (Tripped)
            </button>
          </div>

          {/* Trace Request Button */}
          <button
            onClick={handleSimulateTrace}
            disabled={isTracingRequest}
            className="inline-flex items-center gap-1.5 rounded-sm bg-[#d4af37] px-3 py-1.5 text-xs font-semibold text-[#0b0c10] hover:bg-[#e6c158] active:scale-95 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <Play className={`h-3 w-3 ${isTracingRequest ? 'animate-spin' : ''}`} />
            <span>{isTracingRequest ? 'Tracing Traceparent...' : 'Simulate Order Checkout'}</span>
          </button>
        </div>
      </div>

      {/* Main Service Mesh Topology Canvas */}
      <div className="relative rounded-md border border-[#212433] bg-[#08090d] p-4 sm:p-6 overflow-x-auto">
        <div className="min-w-[760px] space-y-6">

          {/* Tier 1: Client -> API Gateway */}
          <div className="flex items-center justify-between gap-4">
            {/* User Browser / Mobile */}
            <div className={`p-3 rounded-sm border w-44 shrink-0 transition-all ${
              activeStep === 1 ? 'border-[#38bdf8] bg-[#38bdf8]/15 ring-1 ring-[#38bdf8]' : 'border-[#232634] bg-[#12141c]'
            }`}>
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#38bdf8]">
                <Globe className="h-3 w-3" /> Client App
              </div>
              <div className="text-xs font-semibold text-[#ffffff] mt-0.5">POST /v1/checkout</div>
              <div className="text-[9px] font-mono text-[#64748b]">Idempotency-Key: 9af3-..</div>
            </div>

            {/* Ingress Link */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-full h-0.5 bg-[#232634] relative">
                {activeStep === 1 && (
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 h-2 w-4 bg-[#38bdf8] rounded-full animate-[moveRight_0.6s_linear_infinite]" />
                )}
              </div>
              <span className="text-[9px] font-mono text-[#64748b] mt-1">HTTPS / TLS 1.3</span>
            </div>

            {/* API Gateway */}
            <div 
              onClick={() => setSelectedServiceId('gateway')}
              className={`p-3 rounded-sm border w-56 shrink-0 transition-all cursor-pointer ${
                activeStep === 2 ? 'border-[#d4af37] bg-[#d4af37]/15 ring-2 ring-[#d4af37]' :
                selectedServiceId === 'gateway' ? 'border-[#d4af37] bg-[#1a1c28]' : 'border-[#282b3a] bg-[#141622]'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#d4af37]">
                <span>API Gateway</span>
                <span className="text-[#22c55e]">Kong / Envoy</span>
              </div>
              <div className="text-xs font-semibold text-[#ffffff] mt-0.5">L7 Ingress Controller</div>
              <div className="text-[9px] font-mono text-[#94a3b8] mt-1">JWT verify &bull; Token bucket rate limit</div>
            </div>

            {/* gRPC Internal Link */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-full h-0.5 bg-[#232634] relative">
                {activeStep === 2 && (
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 h-2 w-4 bg-[#d4af37] rounded-full animate-[moveRight_0.6s_linear_infinite]" />
                )}
              </div>
              <span className="text-[9px] font-mono text-[#d4af37] mt-1">mTLS Internal gRPC</span>
            </div>

            {/* Core Order Service */}
            <div 
              onClick={() => setSelectedServiceId('orders')}
              className={`p-3 rounded-sm border w-56 shrink-0 transition-all cursor-pointer ${
                activeStep === 2 || activeStep === 3 ? 'border-[#22c55e] bg-[#22c55e]/15 ring-2 ring-[#22c55e]' :
                selectedServiceId === 'orders' ? 'border-[#d4af37] bg-[#1a1c28]' : 'border-[#282b3a] bg-[#141622]'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#22c55e]">
                <span>Order Service</span>
                <span className="bg-[#22c55e]/20 text-[#4ade80] px-1 rounded-xs">Envoy Pod</span>
              </div>
              <div className="text-xs font-semibold text-[#ffffff] mt-0.5">Saga Coordinator</div>
              <div className="text-[9px] font-mono text-[#94a3b8] mt-1">traceparent: 00-4bf9...</div>
            </div>
          </div>

          {/* Tier 2: Downstream Inter-Service Choreography */}
          <div className="pt-4 border-t border-[#1a1c27] grid grid-cols-3 gap-4">

            {/* Service A: Inventory Service */}
            <div 
              onClick={() => setSelectedServiceId('inventory')}
              className={`p-3 rounded-sm border transition-all cursor-pointer ${
                activeStep === 3 ? 'border-[#38bdf8] bg-[#38bdf8]/15 ring-1 ring-[#38bdf8]' :
                selectedServiceId === 'inventory' ? 'border-[#d4af37] bg-[#1a1c28]' : 'border-[#232634] bg-[#10121a]'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-[#38bdf8]">
                <span>gRPC Downstream</span>
                <span>Atomic Lock</span>
              </div>
              <div className="text-xs font-semibold text-[#ffffff] mt-0.5">Inventory Service</div>
              <p className="text-[10px] text-[#94a3b8] mt-1">
                Redis Mutex item hold &bull; p99: 3.2ms
              </p>
              {activeStep === 3 && (
                <span className="inline-block mt-2 text-[9px] font-mono text-[#38bdf8] bg-[#38bdf8]/20 px-1.5 py-0.5 rounded-xs">
                  Stock Reserved
                </span>
              )}
            </div>

            {/* Service B: Payment Service + Circuit Breaker */}
            <div 
              onClick={() => setSelectedServiceId('payments')}
              className={`p-3 rounded-sm border transition-all cursor-pointer relative ${
                activeStep === 99 ? 'border-[#ef4444] bg-[#ef4444]/20 ring-2 ring-[#ef4444]' :
                activeStep === 4 ? 'border-[#22c55e] bg-[#22c55e]/15 ring-1 ring-[#22c55e]' :
                selectedServiceId === 'payments' ? 'border-[#d4af37] bg-[#1a1c28]' : 'border-[#232634] bg-[#10121a]'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#d4af37]">Payment Gateway</span>
                <span className={`px-1.5 py-0.2 rounded-xs font-bold ${
                  circuitBreakerState === 'closed' ? 'bg-[#22c55e]/20 text-[#4ade80]' :
                  circuitBreakerState === 'half_open' ? 'bg-[#f59e0b]/20 text-[#fbbf24]' :
                  'bg-[#ef4444]/20 text-[#f87171]'
                }`}>
                  CB: {circuitBreakerState.toUpperCase()}
                </span>
              </div>
              <div className="text-xs font-semibold text-[#ffffff] mt-0.5">Stripe/Adyen Adapter</div>
              <p className="text-[10px] text-[#94a3b8] mt-1">
                {circuitBreakerState === 'open' 
                  ? 'Tripped: Fast fail with HTTP 503 fallback!' 
                  : 'Double-entry ledger & idempotency key'}
              </p>

              {activeStep === 99 && (
                <div className="mt-2 text-[9px] font-mono text-[#ef4444] flex items-center gap-1 font-bold">
                  <ShieldAlert className="h-3 w-3" /> Circuit OPEN: Fast Fail Returned (0ms)
                </div>
              )}
            </div>

            {/* Service C: Async Kafka Notification Stream */}
            <div 
              onClick={() => setSelectedServiceId('notifications')}
              className={`p-3 rounded-sm border transition-all cursor-pointer ${
                activeStep === 5 ? 'border-[#a855f7] bg-[#a855f7]/15 ring-1 ring-[#a855f7]' :
                selectedServiceId === 'notifications' ? 'border-[#d4af37] bg-[#1a1c28]' : 'border-[#232634] bg-[#10121a]'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-[#a855f7]">
                <span>Kafka Event Bus</span>
                <span>Topic: orders.created</span>
              </div>
              <div className="text-xs font-semibold text-[#ffffff] mt-0.5">Notification Worker</div>
              <p className="text-[10px] text-[#94a3b8] mt-1">
                Transactional Outbox &bull; Consumer Group Auto-ACK
              </p>
              {activeStep === 5 && (
                <span className="inline-block mt-2 text-[9px] font-mono text-[#a855f7] bg-[#a855f7]/20 px-1.5 py-0.5 rounded-xs">
                  Event Dispatched &bull; Offset Committed
                </span>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Deep Inspection Panel */}
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="rounded-sm border border-[#232634] bg-[#12141c] p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-[#d4af37] font-semibold">
            <Radio className="h-3.5 w-3.5 text-[#d4af37]" />
            Sidecar Mesh Architecture (Envoy)
          </div>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            Every Kubernetes pod runs an Envoy proxy as a sidecar container. All inbound and outbound traffic intercepts localhost:15001 via iptables, transparently providing mutual TLS (mTLS), distributed tracing headers, and circuit breaking without application code modification.
          </p>
        </div>

        <div className="rounded-sm border border-[#232634] bg-[#12141c] p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-[#ef4444] font-semibold">
            <AlertOctagon className="h-3.5 w-3.5 text-[#ef4444]" />
            Circuit Breaker Finite State Machine
          </div>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            When downstream failure rate exceeds 50%, state switches from <strong>CLOSED</strong> to <strong>OPEN</strong> for 30s sleep window, preventing cascade crashes. After sleep window, <strong>HALF-OPEN</strong> allows 10% trial canary probes to test remote health.
          </p>
        </div>

        <div className="rounded-sm border border-[#232634] bg-[#12141c] p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-[#22c55e] font-semibold">
            <Layers className="h-3.5 w-3.5 text-[#22c55e]" />
            Inspector: {selectedService.name}
          </div>
          <div className="text-xs space-y-1 font-mono text-[#cbd5e1]">
            <div className="flex justify-between">
              <span className="text-[#94a3b8]">Protocol:</span>
              <span className="text-[#38bdf8]">{selectedService.protocol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94a3b8]">Tech Stack:</span>
              <span>{selectedService.tech}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94a3b8]">HA Policy:</span>
              <span className="text-[#cbd5e1] text-[10px] truncate max-w-[140px]">{selectedService.resilience}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

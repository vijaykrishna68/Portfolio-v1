import{j as n}from"./index-Byl_8200.js";import{i as o,w as h,r as p}from"./assets-Dz36pXJA.js";const u={type:"project",title:"Clinical Data Pipeline",description:"HIPAA-compliant ingestion pipeline for a healthtech startup, aggregating patient vitals from 12 IoT device types into a unified API consumed by clinicians and ML models in real time.",status:"published",publishedAt:"2023-06-01",tags:["Python","FastAPI","Apache Kafka","TimescaleDB","Docker"],year:"2022 – 2023",challenge:"Event sourcing architecture that supports historical replay for model training while maintaining the strict audit trail required for FDA compliance — without sacrificing real-time latency.",technologies:["Python","FastAPI","Apache Kafka","TimescaleDB","Docker"],impact:"Data latency dropped from 45 minutes to under 8 seconds for 1,200 daily active patients.",cover:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1400&h=900&fit=crop&auto=format&q=80",coverAlt:"Healthcare technology interface showing patient data",displayIndex:"02",displayLayout:"flip",featured:!0,featuredIndex:"03",role:"Backend Engineer",hook:"Every second of latency between a patient's heartbeat and a clinician's screen is a second of diagnostic blindness."};function r(i){const e={code:"code",h2:"h2",p:"p",strong:"strong",...i.components};return n.jsxs(n.Fragment,{children:[n.jsx(e.h2,{children:"Problem"}),`
`,n.jsx(e.p,{children:"The startup had 12 different IoT device types reporting patient vitals. Each device had its own binary protocol, its own clock drift characteristics, its own failure modes. The existing pipeline collected data on a 45-minute polling cycle — fine for long-term trend analysis, dangerous for real-time monitoring."}),`
`,n.jsx(e.p,{children:"Clinicians needed data within 10 seconds. ML models needed three years of historical data in a consistent format. The FDA required an immutable audit trail of every data transformation. These three requirements were in direct tension with each other."}),`
`,n.jsx(e.h2,{children:"Architecture"}),`
`,n.jsxs(e.p,{children:["We built an ",n.jsx(e.strong,{children:"event-sourced pipeline"})," with three distinct consumers:"]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Ingestion layer."})," A FastAPI service with device-specific adapters translates each binary protocol into a canonical ",n.jsx(e.code,{children:"VitalEvent"})," protobuf. Device clock drift is corrected using a Kalman filter calibrated per device type. Events land in Kafka with the original binary payload attached."]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Real-time consumer."})," A streaming consumer writes normalized vital readings to TimescaleDB hypertables. TimescaleDB's native time-series compression lets us store 18 months of readings in the same space that a vanilla PostgreSQL table would need for 3 months."]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Historical replay."})," The raw Kafka events are replicated to S3 (Kafka MirrorMaker 2). Model training jobs replay events through the same normalization pipeline — guaranteeing that training data and real-time data have identical transformations applied."]}),`
`,n.jsx(e.h2,{children:"HIPAA and FDA Compliance"}),`
`,n.jsx(e.p,{children:"The audit trail requirement shaped every design decision."}),`
`,n.jsxs(e.p,{children:["We cannot modify an event after it lands in Kafka. The partition offset is the audit key. Every downstream transformation writes a new event with a ",n.jsx(e.code,{children:"derivedFrom"}),' pointer to the source offset. The FDA audit path is: "show me every transformation applied to reading X" — we walk the ',n.jsx(e.code,{children:"derivedFrom"})," chain backwards."]}),`
`,n.jsx(e.p,{children:"HIPAA required that PHI (patient health information) never appear in logs, metrics, or error messages. We wrote a custom Python logging filter that strips fields in a configured PHI field list before any log record is emitted. Prometheus metrics carry patient count but never patient identifiers."}),`
`,n.jsx(e.h2,{children:"Lessons Learned"}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Clock drift is the enemy."})," Seven of twelve device types had clocks that drifted by up to 90 seconds per hour under heavy load. Naively trusting device timestamps would have made vitals appear to arrive in the wrong order. The Kalman filter took two weeks to tune correctly and made the data trustworthy."]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Event sourcing is only as good as your schema evolution story."})," Halfway through the project, one device type changed its packet structure in a firmware update. Because we stored the raw binary payload, we could replay historical events through a new adapter and backfill the normalization. Without that, we would have had a two-week gap in training data."]})]})}function m(i={}){const{wrapper:e}=i.components||{};return e?n.jsx(e,{...i,children:n.jsx(r,{...i})}):r(i)}const x=Object.freeze(Object.defineProperty({__proto__:null,default:m,frontmatter:u},Symbol.toStringTag,{value:"Module"})),g={type:"project",title:"Manufacturing Intelligence Platform",description:"A real-time production scheduling system that replaced manual Excel-based workflows across three factory floors. Processes 50,000+ scheduling events daily with sub-100ms response times.",status:"published",publishedAt:"2022-12-01",tags:["Go","PostgreSQL","Redis","gRPC","React"],year:"2021 – 2022",challenge:"Modeling complex constraint satisfaction — machines with maintenance windows, operators with shift constraints, materials with lead times — into a scheduling algorithm production managers could actually trust.",technologies:["Go","PostgreSQL","Redis","gRPC","React"],impact:"73% reduction in scheduling conflicts. 14 hours/week of manual replanning eliminated.",cover:"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1400&h=900&fit=crop&auto=format&q=80",coverAlt:"Software engineer working on industrial scheduling system",displayIndex:"01",displayLayout:"default",featured:!0,featuredIndex:"02",role:"Backend Engineer",hook:"Replacing Excel chaos with constraint-satisfaction scheduling on the factory floor."};function a(i){const e={em:"em",h2:"h2",p:"p",strong:"strong",...i.components};return n.jsxs(n.Fragment,{children:[n.jsx(e.h2,{children:"Problem"}),`
`,n.jsx(e.p,{children:"Three factory floors. Three production managers. Three separate Excel spreadsheets, reconciled manually every morning at 6 AM."}),`
`,n.jsx(e.p,{children:"When a machine broke down or a raw material shipment came in late, someone had to open all three files, cross-reference operator shift schedules, check machine maintenance windows, and redistribute work by hand. On a good day this took 90 minutes. On a bad day, the 6 AM reconciliation ran until noon — and production had already started on the wrong schedule."}),`
`,n.jsx(e.p,{children:"The business case was obvious. The technical challenge was not."}),`
`,n.jsx(e.h2,{children:"Architecture"}),`
`,n.jsxs(e.p,{children:["The core problem is a variant of the ",n.jsx(e.strong,{children:"Job Shop Scheduling Problem"})," — provably NP-hard in the general case. We didn't need an optimal solution. We needed a ",n.jsx(e.em,{children:"good enough"})," solution, fast, with explanations that production managers could actually understand and override."]}),`
`,n.jsx(e.p,{children:"We built a two-phase system:"}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Phase 1 — Constraint evaluation."})," A Go service consumes a stream of events (machine status, operator clock-ins, material arrivals) via Kafka and maintains a materialized view of current floor state in Redis. Each event triggers a constraint re-evaluation pass: which jobs can still run, on which machines, with which operators."]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Phase 2 — Schedule generation."})," A greedy backtracking algorithm generates candidate schedules against the current constraint set. Redis sorted sets let us rank machines by availability with O(log N) lookups. gRPC streams push schedule updates to the React dashboard in real time."]}),`
`,n.jsx(e.h2,{children:"Technical Decisions"}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Why Go?"})," The constraint evaluator runs on every incoming event. At 50K events/day the performance headroom matters less than I thought — but the goroutine model made it trivial to parallelize constraint evaluation across machines."]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Why backtracking over OR-Tools?"}),` We evaluated Google's OR-Tools constraint programming library. It produces better schedules. It also produced schedules that production managers couldn't follow. Backtracking with a fixed priority order gives worse schedules but the explanation is always the same: "higher-priority jobs run first, maintenance windows are respected." Operators trusted it.`]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Why not CQRS all the way down?"})," The write path (event log) and read path (materialized schedule view) are separated, but the schedule generation reads directly from the materialized view rather than replaying the event log. Replaying 50K events to generate one schedule on every request was too slow. Eventual consistency with a 2-second lag was an acceptable tradeoff."]}),`
`,n.jsx(e.h2,{children:"Lessons Learned"}),`
`,n.jsxs(e.p,{children:["The hardest part of this project wasn't the algorithm. It was the ",n.jsx(e.strong,{children:"interface between the algorithm's output and production manager expectations"}),"."]}),`
`,n.jsx(e.p,{children:`Early prototype: the algorithm generated a schedule. Production managers said "this is wrong" and did it manually. We added a diff view showing what changed and why. Production managers said "this is still wrong." We added overrides. They started using overrides to express constraints the algorithm didn't know about — machine X always runs hot in the afternoon so it should run lighter jobs then.`}),`
`,n.jsxs(e.p,{children:["We ended up building a ",n.jsx(e.strong,{children:"constraint capture UI"})," where overrides became named rules. The algorithm got better. Overrides decreased. The lesson: the model of the problem was incomplete, and the only way to complete it was to give users a way to express what the model missed."]})]})}function j(i={}){const{wrapper:e}=i.components||{};return e?n.jsx(e,{...i,children:n.jsx(a,{...i})}):a(i)}const f=Object.freeze(Object.defineProperty({__proto__:null,default:j,frontmatter:g},Symbol.toStringTag,{value:"Module"})),w="/assets/dashboard-overview-BFF71gH6.png",y="/assets/allocation-table-CVXcbGc8.png",b={type:"project",title:"Vector — Production Scheduling Platform",description:"A capacity-aware production scheduling platform that turns Excel-based manufacturing demand into validated, deterministic production plans.",status:"published",publishedAt:"2026-05-27",tags:["React","Vite","Tailwind CSS","Node.js","Express","MongoDB","Mongoose","xlsx","Render"],cover:"./cover.png",coverAlt:"Vector production-line capacity and weekly allocation overview",year:"2026 – 2026",challenge:"Replace a manual Excel-based production planning workflow with a deterministic, capacity-aware scheduling system while preserving the planner's existing workbook workflow.",technologies:["React","Vite","Tailwind CSS","Node.js","Express","MongoDB","Mongoose","xlsx","node:test","Render"],impact:"Cut manual production allocation from 3 days to 30 minutes. A separate workbook-serialization fix also made schedule generation ~141× faster (~75.6s to ~0.54s), with byte-identical output verified across 315,070 cells.",displayIndex:"03",displayLayout:"default",featured:!0,featuredIndex:"01",hook:"Turning a planner's Excel workbook into a deterministic, capacity-aware production schedule — without taking Excel away from them.",links:{github:"https://github.com/vijaykrishna68/Vector_UPDATE",live:"https://vector-update-403i.onrender.com/",writeup:""}};function s(i){const e={a:"a",code:"code",h2:"h2",h3:"h3",hr:"hr",img:"img",li:"li",p:"p",pre:"pre",ul:"ul",...i.components};return n.jsxs(n.Fragment,{children:[n.jsx(e.h2,{children:"Problem"}),`
`,n.jsx(e.p,{children:"Production demand arrived as Excel workbooks containing parts, weekly quantities, production-line assignments, cycle times, and working-day information. Turning that demand into a production plan required handling capacity, allocation priorities, fallback rules, and exceptions without silently overcommitting a line."}),`
`,n.jsxs(e.p,{children:["The real problem was not simply generating a schedule. It was making the scheduling process ",n.jsx(e.code,{children:"repeatable"}),", ",n.jsx(e.code,{children:"capacity-aware"}),", and ",n.jsx(e.code,{children:"trustworthy"})," while preserving the Excel workflow planners already used."]}),`
`,n.jsxs(e.p,{children:["Vector was built to take the workbook from ",n.jsx(e.code,{children:"upload → validation → normalization → allocation → persistence → review"}),", with failures and unallocated demand surfaced explicitly instead of disappearing inside a spreadsheet."]}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Gallery"}),`
`,n.jsx(e.p,{children:n.jsx(e.img,{src:w,alt:"Vector dashboard showing allocated demand, capacity utilisation, and per-line status"})}),`
`,n.jsx(e.p,{children:n.jsx(e.img,{src:y,alt:"Part-level allocation table for a single planning week, with per-day quantities and status"})}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Background"}),`
`,n.jsx(e.p,{children:"Vector is an end-to-end production scheduling application built around a manufacturing planning workflow."}),`
`,n.jsxs(e.p,{children:["The source of truth remains the planner's ",n.jsx(e.code,{children:".xlsx"})," workbook. The workbook contains schedule data and a working-days sheet, while the application adds validation, deterministic allocation, capacity visibility, run persistence, and a web dashboard."]}),`
`,n.jsx(e.p,{children:"The system has three important boundaries:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"React + Vite"})," provides the planner-facing dashboard, upload flow, weekly schedule, issues, and history views."]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"Node.js + Express"})," handles uploads, validation, APIs, persistence, and orchestration."]}),`
`,n.jsxs(e.li,{children:["A standalone ",n.jsx(e.code,{children:"allocation engine"})," converts normalized demand into a schedule without depending on HTTP, React, or MongoDB."]}),`
`]}),`
`,n.jsx(e.p,{children:"MongoDB stores completed planning runs so a generated schedule can be reviewed after the upload request has finished."}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Constraints"}),`
`,n.jsx(e.p,{children:"The system had to work within the existing planning workflow rather than requiring planners to abandon Excel."}),`
`,n.jsx(e.p,{children:"Key constraints included:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["Input arrives as ",n.jsx(e.code,{children:".xlsx"})," workbooks whose sheet ordering and dimensions cannot be assumed."]}),`
`,n.jsx(e.li,{children:"Scheduling rules are operational heuristics rather than a general-purpose optimization model."}),`
`,n.jsx(e.li,{children:"Four production lines have daily capacity constraints."}),`
`,n.jsx(e.li,{children:"Allocation follows a fixed priority order and predefined fallback chains."}),`
`,n.jsx(e.li,{children:"A line-day must never be allocated beyond its remaining capacity."}),`
`,n.jsx(e.li,{children:"Invalid rows and duplicate demand must be handled without corrupting the planning run."}),`
`,n.jsxs(e.li,{children:["Demand that cannot be placed must become explicit ",n.jsx(e.code,{children:"unallocated demand"}),"."]}),`
`,n.jsx(e.li,{children:"The backend and frontend need to remain separately testable."}),`
`,n.jsx(e.li,{children:"Production deployment needs to serve the React application and API from one origin."}),`
`,n.jsxs(e.li,{children:["Upload validation is required because the ",n.jsx(e.code,{children:"xlsx"})," dependency has known vulnerabilities with no upstream fix currently available."]}),`
`]}),`
`,n.jsx(e.p,{children:"The biggest design constraint was therefore correctness at the boundaries: bad spreadsheet data should be rejected or diagnosed before it reaches the core scheduler."}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Research"}),`
`,n.jsx(e.p,{children:"Before changing the scheduling workflow, the existing workbook behavior and processing path were examined to understand where assumptions lived."}),`
`,n.jsx(e.p,{children:"One important discovery was that workbook structure could not safely be inferred from fixed sheet positions. The parser therefore identifies relevant sheets from meaningful headers and labels."}),`
`,n.jsx(e.p,{children:'The allocation behavior was treated as a set of confirmed business rules rather than something to "optimize" without domain evidence. This led to a deterministic heuristic instead of introducing a general-purpose optimization solver.'}),`
`,n.jsxs(e.p,{children:["Testing also shaped the implementation. ",n.jsx(e.code,{children:"Characterization tests"})," preserve important existing behavior, while ",n.jsx(e.code,{children:"golden-master"})," snapshots make changes to generated schedules visible."]}),`
`,n.jsx(e.p,{children:"A separate performance investigation focused on workbook serialization. Some workbooks declared ranges extending toward Excel's approximately 1,048,576-row limit even when most rows were empty. Measuring the actual populated cell extent revealed that the writer was doing far more work than the data required."}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Architecture"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-text",children:`┌──────────────────┐\r
│   Excel Upload   │\r
└────────┬─────────┘\r
         │\r
         ▼\r
┌──────────────────┐\r
│ Validate / Parse │\r
└────────┬─────────┘\r
         │\r
         ▼\r
┌──────────────────┐\r
│    Normalize     │\r
│ duplicates / bad │\r
│       rows       │\r
└────────┬─────────┘\r
         │\r
         ▼\r
┌──────────────────┐\r
│ Allocation Engine │\r
│ capacity / rules │\r
└───────┬─────┬────┘\r
        │     │\r
        ▼     ▼\r
┌───────────┐ ┌──────────────┐\r
│ MongoDB   │ │ Excel Output │\r
│ Run Store │ │  / Download  │\r
└─────┬─────┘ └──────────────┘\r
      │\r
      ▼\r
┌──────────────────┐\r
│ React Dashboard  │\r
│ Schedule / Issues│\r
│      / History   │\r
└──────────────────┘
`})}),`
`,n.jsx(e.h3,{children:"Client"}),`
`,n.jsxs(e.p,{children:[n.jsx(e.code,{children:"React + Vite + Tailwind CSS"})," powers the single-page planner interface."]}),`
`,n.jsx(e.p,{children:"The client displays operational results but does not contain the scheduling rules. It consumes API data for dashboard metrics, weekly schedules, issues, and planning history."}),`
`,n.jsx(e.h3,{children:"Server"}),`
`,n.jsxs(e.p,{children:[n.jsx(e.code,{children:"Node.js + Express"})," provides the API, upload handling, validation boundary, and application orchestration."]}),`
`,n.jsxs(e.p,{children:["The backend follows a ",n.jsx(e.code,{children:"routes → controllers → services → models"})," structure so HTTP concerns remain separate from business logic."]}),`
`,n.jsx(e.h3,{children:"Allocation Engine"}),`
`,n.jsx(e.p,{children:"The allocation engine is intentionally independent from the API and UI. It receives normalized planning data and returns allocation results plus diagnostics."}),`
`,n.jsx(e.p,{children:"This boundary makes the core scheduling behavior testable without starting the web server."}),`
`,n.jsx(e.h3,{children:"Database"}),`
`,n.jsxs(e.p,{children:[n.jsx(e.code,{children:"MongoDB + Mongoose"})," stores planning runs and their allocation results, line totals, and diagnostics."]}),`
`,n.jsx(e.h3,{children:"Excel Processing"}),`
`,n.jsxs(e.p,{children:[n.jsx(e.code,{children:"xlsx"})," parses the incoming workbook and writes the generated schedule back into the workbook format planners already use."]}),`
`,n.jsx(e.p,{children:"The parser discovers relevant sheets, validates rows, normalizes demand, and only then passes data to the scheduler."}),`
`,n.jsx(e.h3,{children:"Deployment"}),`
`,n.jsxs(e.p,{children:["The production application runs as a ",n.jsx(e.code,{children:"single Node.js service"})," on Render. Express serves both the built React application and the JSON API from the same origin, with MongoDB providing persistent storage."]}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Technical Decisions"}),`
`,n.jsx(e.h3,{children:"Decision: Deterministic heuristic instead of a general optimizer"}),`
`,n.jsx(e.p,{children:n.jsx(e.code,{children:"Options considered:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"General-purpose optimization — potentially stronger global optimization, but introduces additional model complexity and makes the confirmed factory rules harder to reason about."}),`
`,n.jsx(e.li,{children:"Deterministic rule-based allocation — directly expresses the known priorities, fallbacks, capacity boundaries, and tolerance behavior."}),`
`]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.code,{children:"Chosen:"})," Deterministic rule-based allocation."]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.code,{children:"Why:"})," The goal was to reliably implement the confirmed production rules, not to claim that the schedule is globally optimal. A deterministic engine is easier to test, reproduce, and explain to planners."]}),`
`,n.jsx(e.h3,{children:"Decision: Normalize before allocation"}),`
`,n.jsx(e.p,{children:n.jsx(e.code,{children:"Options considered:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Let the allocation engine interpret raw spreadsheet rows — simpler input plumbing, but business logic becomes coupled to messy workbook data."}),`
`,n.jsx(e.li,{children:"Normalize and validate at the boundary — adds an explicit processing stage but gives the scheduler a predictable internal model."}),`
`]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.code,{children:"Chosen:"})," Boundary validation and normalization."]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.code,{children:"Why:"})," Duplicate rows, invalid quantities, missing specifications, and invalid cycle times are data-quality concerns. Handling them before allocation keeps the scheduling engine focused on scheduling."]}),`
`,n.jsx(e.h3,{children:"Decision: Preserve Excel as the primary workflow"}),`
`,n.jsx(e.p,{children:n.jsx(e.code,{children:"Options considered:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Replace Excel with a completely native planning interface."}),`
`,n.jsx(e.li,{children:"Keep Excel as input/output and add validation, scheduling, and visibility around it."}),`
`]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.code,{children:"Chosen:"})," Preserve the workbook workflow."]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.code,{children:"Why:"})," The application improves the existing process without forcing planners to re-enter demand into a new system."]}),`
`,n.jsx(e.h3,{children:"Decision: Single-service production deployment"}),`
`,n.jsx(e.p,{children:n.jsx(e.code,{children:"Options considered:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Deploy the frontend and backend separately."}),`
`,n.jsx(e.li,{children:"Serve the built SPA and API from the same Express service."}),`
`]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.code,{children:"Chosen:"})," Single service."]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.code,{children:"Why:"})," The application does not currently need independent frontend/backend scaling. Same-origin deployment also avoids unnecessary cross-origin configuration."]}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Challenges"}),`
`,n.jsx(e.h3,{children:"Excel data was less predictable than the UI suggested"}),`
`,n.jsx(e.p,{children:"The workbook could contain variable sheet ordering, duplicate part/week rows, invalid quantities, missing specifications, and other data-quality issues."}),`
`,n.jsxs(e.p,{children:["The solution was to create an explicit ",n.jsx(e.code,{children:"validation → normalization"})," boundary. Duplicate rows are merged and reported, while invalid records become diagnostics instead of crashing the run or silently entering the scheduler."]}),`
`,n.jsx(e.h3,{children:"Capacity needed to be enforced continuously"}),`
`,n.jsxs(e.p,{children:["A production line has daily capacity calculated from ",n.jsx(e.code,{children:"workers × 475 minutes"}),". Allocation therefore cannot simply distribute weekly quantities and check capacity afterward."]}),`
`,n.jsxs(e.p,{children:["The engine maintains a shared running capacity model and ensures every line-day allocation is bounded by ",n.jsx(e.code,{children:"remaining capacity"}),". Overflow can move only through predefined fallback chains or forward into later eligible dates."]}),`
`,n.jsx(e.h3,{children:"Workbook serialization became the unexpected bottleneck"}),`
`,n.jsx(e.p,{children:"The allocation logic was not the slow part of one important workflow. Workbook serialization was."}),`
`,n.jsx(e.p,{children:"Some workbooks advertised extremely large used ranges despite containing mostly empty rows. The writer consequently serialized close to a million rows."}),`
`,n.jsx(e.p,{children:"The fix recomputed the actual populated extent from cell keys before writing."}),`
`,n.jsx(e.p,{children:"Result:"}),`
`,n.jsx(e.p,{children:n.jsx(e.code,{children:"~75.6s → ~0.54s"})}),`
`,n.jsxs(e.p,{children:["That is approximately ",n.jsx(e.code,{children:"141× faster"})," for the workbook-write operation, with output verified ",n.jsx(e.code,{children:"byte-identical"})," across ",n.jsx(e.code,{children:"315,070 cells"}),"."]}),`
`,n.jsx(e.h3,{children:"Production exposed a dependency-installation difference"}),`
`,n.jsxs(e.p,{children:["The first Render deployment built successfully locally but failed in production because Render's production-mode installation skipped ",n.jsx(e.code,{children:"devDependencies"}),". ",n.jsx(e.code,{children:"@vitejs/plugin-react"})," was therefore unavailable when Vite loaded the configuration."]}),`
`,n.jsxs(e.p,{children:["The failure was first ",n.jsx(e.code,{children:"reproduced locally"})," using the same production-mode install. The dependency was then moved into ",n.jsx(e.code,{children:"dependencies"}),", followed by a clean production-mode build and full deployment-path verification."]}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Tradeoffs"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"Deterministic heuristic"})," over global optimization: easier to verify and explain, but not a universal scheduling optimizer."]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"Single-service deployment"})," over independent services: simpler operations and same-origin requests, but less flexibility for independent scaling."]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"Excel workflow"})," over a native planning interface: lower adoption friction, but continued dependence on workbook conventions."]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"Explicit diagnostics"})," over silent correction: exceptions become visible, but planners must review cases that cannot be allocated."]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"MongoDB persistence"})," over returning only a generated workbook: enables run history and review, but introduces database availability as a production dependency."]}),`
`]}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Results"}),`
`,n.jsxs(e.p,{children:["Vector now provides a complete ",n.jsx(e.code,{children:"Excel → schedule"})," workflow:"]}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Validates and normalizes planner workbooks."}),`
`,n.jsxs(e.li,{children:["Runs deterministic ",n.jsx(e.code,{children:"capacity-aware allocation"})," across four production lines."]}),`
`,n.jsx(e.li,{children:"Applies fixed priorities and fallback chains."}),`
`,n.jsx(e.li,{children:"Prevents line-day overcommitment."}),`
`,n.jsxs(e.li,{children:["Surfaces ",n.jsx(e.code,{children:"duplicates"}),", ",n.jsx(e.code,{children:"invalid input"}),", and ",n.jsx(e.code,{children:"unallocated demand"}),"."]}),`
`,n.jsx(e.li,{children:"Persists planning runs for later review."}),`
`,n.jsx(e.li,{children:"Provides dashboard, weekly schedule, issues, and history views."}),`
`,n.jsx(e.li,{children:"Returns the generated workbook in the planner's existing format."}),`
`,n.jsx(e.li,{children:"Runs as a live production deployment serving the React application and Express API from one origin."}),`
`]}),`
`,n.jsx(e.p,{children:"The clearest measured performance result is the workbook serialization optimization:"}),`
`,n.jsx(e.p,{children:n.jsx(e.code,{children:"~75.6s → ~0.54s"})}),`
`,n.jsxs(e.p,{children:[n.jsx(e.code,{children:"~141× faster"}),", with ",n.jsx(e.code,{children:"byte-identical"})," output verified across ",n.jsx(e.code,{children:"315,070 cells"}),"."]}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Lessons Learned"}),`
`,n.jsx(e.p,{children:"The biggest lesson was that the most important engineering work was often at the boundaries rather than in the main algorithm."}),`
`,n.jsxs(e.p,{children:[n.jsx(e.code,{children:"Validate before allocating."})," A scheduler can be logically correct and still produce unreliable results if malformed spreadsheet data reaches it."]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.code,{children:"Measure the real bottleneck."})," The largest performance improvement came from inspecting what the workbook writer was actually serializing rather than assuming the allocation algorithm was responsible for the delay."]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.code,{children:"Reproduce production failures locally."})," The Render dependency failure became straightforward once the production installation behavior was reproduced locally."]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.code,{children:"Keep business rules isolated."})," Separating the allocation engine from HTTP and presentation made the core behavior easier to test and reason about."]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.code,{children:"Make exceptions visible."})," In production planning, an explicit unallocated quantity is safer than a system that quietly hides the fact that demand could not be scheduled."]}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Future Improvements"}),`
`,n.jsx(e.p,{children:"The next improvements should focus on known limitations rather than adding unrelated features."}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["Clarify the business meaning behind the remaining ",n.jsx(e.code,{children:"OVERLOAD"})," diagnostic instead of inferring a rule that has not been confirmed."]}),`
`,n.jsx(e.li,{children:"Revisit weekly-bucket tolerance behavior where a small amount of demand can remain unallocated even when later capacity exists."}),`
`,n.jsx(e.li,{children:"Add a continuous integration pipeline so lint, build, and tests run automatically for changes."}),`
`,n.jsx(e.li,{children:"Add representative concurrent-usage and load-testing data before making claims about production scale."}),`
`,n.jsxs(e.li,{children:["Continue evaluating the ",n.jsx(e.code,{children:"xlsx"})," dependency and its vulnerability status as upstream fixes become available."]}),`
`,n.jsx(e.li,{children:"Add more operational observability around allocation decisions and production runs."}),`
`]}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"References"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.a,{href:"https://github.com/vijaykrishna68/Vector_UPDATE",children:"Vector GitHub repository"})," — source code for the production scheduling application."]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.a,{href:"https://vector-update-403i.onrender.com/",children:"Live Vector deployment"})," — hosted production instance."]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.a,{href:"https://nodejs.org/api/test.html",children:"Node.js test runner documentation"})," — the built-in test runner used by the project."]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.a,{href:"https://render.com/docs",children:"Render documentation"})," — deployment platform used for the live service."]}),`
`]})]})}function v(i={}){const{wrapper:e}=i.components||{};return e?n.jsx(e,{...i,children:n.jsx(s,{...i})}):s(i)}const k=Object.freeze(Object.defineProperty({__proto__:null,default:v,frontmatter:b},Symbol.toStringTag,{value:"Module"})),T=Object.assign({"/content/projects/clinical-data-pipeline/index.mdx":x,"/content/projects/manufacturing-intelligence-platform/index.mdx":f,"/content/projects/production-line-scheduling-system/index.mdx":k});function l(){return Object.entries(T).map(([i,e])=>{const d=i.split("/")[3],c=i.substring(0,i.lastIndexOf("/")),t={slug:d,...h(e.frontmatter),Component:e.default};return t.cover&&(t.cover=p(t.cover,c)),t})}function P(){return l().filter(i=>o(i.status)).sort((i,e)=>i.displayIndex.localeCompare(e.displayIndex))}function D(i){return l().find(e=>e.slug===i&&o(e.status))}function E(){return P().filter(i=>i.featured).sort((i,e)=>(i.featuredIndex??i.displayIndex).localeCompare(e.featuredIndex??e.displayIndex))}export{P as a,D as b,E as g};

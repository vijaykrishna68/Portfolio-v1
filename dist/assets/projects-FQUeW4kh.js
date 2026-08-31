import{j as n}from"./index-Dp9W8XoH.js";import{i as o,w as h,r as p}from"./assets-BldAag6z.js";const u={type:"project",title:"Clinical Data Pipeline",description:"HIPAA-compliant ingestion pipeline for a healthtech startup, aggregating patient vitals from 12 IoT device types into a unified API consumed by clinicians and ML models in real time.",status:"published",publishedAt:"2023-06-01",tags:["Python","FastAPI","Apache Kafka","TimescaleDB","Docker"],year:"2022 – 2023",challenge:"Event sourcing architecture that supports historical replay for model training while maintaining the strict audit trail required for FDA compliance — without sacrificing real-time latency.",technologies:["Python","FastAPI","Apache Kafka","TimescaleDB","Docker"],impact:"Data latency dropped from 45 minutes to under 8 seconds for 1,200 daily active patients.",cover:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1400&h=900&fit=crop&auto=format&q=80",coverAlt:"Healthcare technology interface showing patient data",displayIndex:"02",displayLayout:"flip",featured:!0,featuredIndex:"03",role:"Backend Engineer",hook:"Every second of latency between a patient's heartbeat and a clinician's screen is a second of diagnostic blindness."};function a(i){const e={code:"code",h2:"h2",p:"p",strong:"strong",...i.components};return n.jsxs(n.Fragment,{children:[n.jsx(e.h2,{children:"Problem"}),`
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
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Event sourcing is only as good as your schema evolution story."})," Halfway through the project, one device type changed its packet structure in a firmware update. Because we stored the raw binary payload, we could replay historical events through a new adapter and backfill the normalization. Without that, we would have had a two-week gap in training data."]})]})}function m(i={}){const{wrapper:e}=i.components||{};return e?n.jsx(e,{...i,children:n.jsx(a,{...i})}):a(i)}const x=Object.freeze(Object.defineProperty({__proto__:null,default:m,frontmatter:u},Symbol.toStringTag,{value:"Module"})),g="/assets/dashboard-overview-BFF71gH6.png",f="/assets/allocation-table-CVXcbGc8.png",j={type:"project",title:"Vector — Production Scheduling Platform",description:"A capacity-aware production scheduling platform that turns Excel-based manufacturing demand into validated, deterministic production plans.",status:"published",publishedAt:"2026-05-27",tags:["React","Vite","Tailwind CSS","Node.js","Express","MongoDB","Mongoose","xlsx","Render"],cover:"./cover.png",coverAlt:"Vector production-line capacity and weekly allocation overview",year:"2026 – 2026",challenge:"Replace a manual Excel-based production planning workflow with a deterministic, capacity-aware scheduling system while preserving the planner's existing workbook workflow.",technologies:["React","Vite","Tailwind CSS","Node.js","Express","MongoDB","Mongoose","xlsx","node:test","Render"],impact:"Cut manual production allocation from 3 days to 30 minutes. A separate workbook-serialization fix also made schedule generation ~141× faster (~75.6s to ~0.54s), with byte-identical output verified across 315,070 cells.",displayIndex:"03",displayLayout:"default",featured:!0,featuredIndex:"01",hook:"Turning a planner's Excel workbook into a deterministic, capacity-aware production schedule — without taking Excel away from them.",links:{github:"https://github.com/vijaykrishna68/Vector_UPDATE",live:"https://vector-update-403i.onrender.com/",writeup:""}};function s(i){const e={a:"a",code:"code",h2:"h2",h3:"h3",hr:"hr",img:"img",li:"li",p:"p",pre:"pre",ul:"ul",...i.components};return n.jsxs(n.Fragment,{children:[n.jsx(e.h2,{children:"Problem"}),`
`,n.jsx(e.p,{children:"Production demand arrived as Excel workbooks containing parts, weekly quantities, production-line assignments, cycle times, and working-day information. Turning that demand into a production plan required handling capacity, allocation priorities, fallback rules, and exceptions without silently overcommitting a line."}),`
`,n.jsxs(e.p,{children:["The real problem was not simply generating a schedule. It was making the scheduling process ",n.jsx(e.code,{children:"repeatable"}),", ",n.jsx(e.code,{children:"capacity-aware"}),", and ",n.jsx(e.code,{children:"trustworthy"})," while preserving the Excel workflow planners already used."]}),`
`,n.jsxs(e.p,{children:["Vector was built to take the workbook from ",n.jsx(e.code,{children:"upload → validation → normalization → allocation → persistence → review"}),", with failures and unallocated demand surfaced explicitly instead of disappearing inside a spreadsheet."]}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Gallery"}),`
`,n.jsx(e.p,{children:n.jsx(e.img,{src:g,alt:"Vector dashboard showing allocated demand, capacity utilisation, and per-line status"})}),`
`,n.jsx(e.p,{children:n.jsx(e.img,{src:f,alt:"Part-level allocation table for a single planning week, with per-day quantities and status"})}),`
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
`]})]})}function y(i={}){const{wrapper:e}=i.components||{};return e?n.jsx(e,{...i,children:n.jsx(s,{...i})}):s(i)}const b=Object.freeze(Object.defineProperty({__proto__:null,default:y,frontmatter:j},Symbol.toStringTag,{value:"Module"})),w="/assets/hero-qYy664OX.png",v="/assets/payment-step-BwXahb2i.png",k="/assets/confirmation-step-LEoSlcXs.png",T={type:"project",title:"S1P Charity - Official Website",description:"Sacrifice One Pizza, A donation flow built around a simple idea — small individual contributions becoming a collective whole — implemented with a dependency-free signature animation, a purpose-scoped state architecture, and accessibility fixes verified through direct testing.",status:"published",publishedAt:"2026-08-29",tags:["React","TypeScript","Tailwind CSS","Accessibility","UX Engineering"],cover:"./cover.png",coverAlt:"The Sacrifice One Pizza hero section, showing the Gathering Point animation and the primary donation call to action",year:"2026",challenge:"Model a four-step donation flow (amount, UPI payment, confirmation, screenshot upload) with clear, independently-testable state boundaries, and pair it with a lightweight, library-free signature animation — without treating accessibility as a final checklist pass.",technologies:["React","TypeScript","Tailwind CSS","Vite","qrcode.react"],impact:"Portfolio project, not live for real donations. Production bundle verified at ~83KB JS / ~15KB CSS gzipped against the deployed build.",displayIndex:"01",displayLayout:"default",featured:!0,featuredIndex:"02",links:{github:"https://github.com/vijaykrishna68/S1P",live:"https://sacrifice-one-pizza-f2z5fkqy2-vijaykrishna68s-projects.vercel.app",writeup:"",caseStudy:""}};function r(i){const e={a:"a",code:"code",em:"em",h2:"h2",h3:"h3",hr:"hr",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...i.components};return n.jsxs(n.Fragment,{children:[n.jsx(e.h2,{children:"Problem"}),`
`,n.jsx(e.p,{children:`Most informal UPI donation pages are a single static QR code with no
confirmation step, or a form that quietly implies the payment has been
verified when nothing on the page could possibly know that. Sacrifice One
Pizza starts from a simple behavioral premise — what you'd spend on one pizza
(₹300–₹3000) can instead fund someone's education or essential needs — and
had to turn that into an honest donation flow: show the donor exactly how to
pay, let them pay in their own UPI app, and collect proof of payment without
ever claiming to verify a transaction the site has no access to.`}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Background"}),`
`,n.jsx(e.p,{children:`Built as a portfolio project from a product brief and design spec (target
amounts, UPI-only payment, a warm and editorial tone rather than a
guilt-driven one). There's no payment gateway integration and no backend —
UPI supports peer-to-peer QR/deep-link payments without one, which shaped the
entire flow around "donor pays externally, then confirms" rather than an
in-page checkout. Designed and built solo, end to end.`}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Constraints"}),`
`,n.jsx(e.p,{children:`No payment gateway meant no server-side confirmation was possible, and the
UI could never imply otherwise. Donation amounts had to be user-entered
rather than preset buttons, valid only in a ₹300–₹3000 UPI range. The
signature hero effect had to stay SVG/CSS only — no animation library, no
canvas — to keep it lightweight. And accessibility couldn't be a final pass:
it had to hold up to actually testing keyboard and focus behavior, not just
adding ARIA attributes and calling it done.`}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Research"}),`
`,n.jsxs(e.p,{children:[`Before writing the donation flow, I confirmed the UPI deep-link format
(`,n.jsx(e.code,{children:"upi://pay?pa=...&am=..."}),`) so the QR code could be generated correctly
client-side with the donor's exact amount pre-filled, instead of shipping a
static placeholder image. I also initially modeled the testimonial
navigation on the WAI-ARIA tabs pattern before realizing that pattern
requires arrow-key roving focus I hadn't built — a dead end caught during
the accessibility audit and corrected to a plainer, honestly-scoped pattern
(see Challenges).`]}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Architecture"}),`
`,n.jsx(e.p,{children:`The app is a single Vite/React/TypeScript bundle with no router and no
backend — one page, one flow, walked through below.`}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{children:`┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│    Amount    │───▶│   Payment    │───▶│ Confirmation │───▶│   Success    │
│ (live-valid.)│    │  (QR + UPI)  │    │(form+upload) │    │              │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
`})}),`
`,n.jsxs(e.p,{children:[`The donation experience, the most complex part, is three separate,
purpose-scoped state machines rather than one large reducer or a pile of
booleans: `,n.jsx(e.code,{children:"donationReducer"}),` tracks which of the four screens is showing;
`,n.jsx(e.code,{children:"confirmationFormReducer"}),` owns the form's fields, validation errors, and
submission status; `,n.jsx(e.code,{children:"useScreenshotUpload"}),` owns the upload lifecycle
independently of both. I rejected a single combined reducer early — it
would mean every keystroke in the confirmation form re-evaluates
step-transition logic that has nothing to do with typing, and would give the
outer flow field-level responsibility that three of its four screens never
touch.`]}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Technical Decisions"}),`
`,n.jsx(e.h3,{children:"Decision: Hero animation implementation"}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Options considered:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:`A heavier animation library — convenient orchestration, but a bundle-size
cost for something native CSS already does well.`}),`
`,n.jsxs(e.li,{children:[`Canvas or a particle system — more visual flexibility, harder to reason
about for `,n.jsx(e.code,{children:"prefers-reduced-motion"})," and DOM-based testing."]}),`
`,n.jsx(e.li,{children:"SVG + CSS keyframes, no library."}),`
`]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Chosen:"})," SVG + CSS keyframes."]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Why:"}),` The animation only needed a handful of elements — five dots, one
core, up to five accumulating "facets" — animating transform/opacity on a
shared clock, exactly what native CSS keyframes do well. A library would
have paid a bundle-size cost for orchestration this simple.`]}),`
`,n.jsx(e.h3,{children:'Decision: What "uploading" means with no backend'}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Options considered:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Fake a network upload with a spinner implying a server received the file."}),`
`,n.jsx(e.li,{children:"Skip the loading state entirely."}),`
`,n.jsx(e.li,{children:'Model "uploading" as real local processing with a short synthetic delay.'}),`
`]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Chosen:"})," Local processing model."]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Why:"}),` There's no backend, so nothing is transferred over a network when a
file is selected. The state honestly represents generating a local preview
via `,n.jsx(e.code,{children:"URL.createObjectURL"}),`, with a short synthetic delay so the state is
visible rather than an instant flash — disclosed as synthetic in a code
comment, not left to look like a fake "upload succeeded" claim.`]}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Challenges"}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Facet timing bug."}),` The hero's rim facets initially reused the dots'
negative-`,n.jsx(e.code,{children:"animation-delay"}),` stagger trick — safe for the dots, whose resting
pose looks the same at any phase, but wrong for facets, whose only hidden
window is the first 8% of their cycle. It put four of five facets into an
"already revealed" state on the very first frame. Scrubbing the Web
Animations API's `,n.jsx(e.code,{children:"currentTime"}),` confirmed the timing math but completely
missed this, since that technique never observes the untouched render. Only
watching the actual page load caught it. Fixed by giving every facet its own
keyframe on one shared, un-shifted clock.`]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Focus management."}),` Advancing the donation flow removed the clicked button
from the DOM each time, and browsers silently reset focus to `,n.jsx(e.code,{children:"<body>"}),` — no
signal to keyboard or screen reader users that anything changed. The same
root cause reappeared twice more: a failed submission never focused the
error, and closing the mobile menu via Escape stranded focus. I fixed all
three the same way — explicitly focusing the new step's heading, the first
invalid field, or the menu's toggle button.`]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"ARIA mismatch."})," Testimonial navigation used ",n.jsx(e.code,{children:'role="tab"'}),"/",n.jsx(e.code,{children:'"tablist"'}),`,
which implies arrow-key roving focus per the WAI-ARIA Authoring Practices —
a behavior I hadn't built. Claiming a widget role without its required
interaction is worse than not claiming it, so I switched to plain buttons
with `,n.jsx(e.code,{children:"aria-current"}),"."]}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Tradeoffs"}),`
`,n.jsx(e.p,{children:`I skipped a visible "validating" state in the confirmation form's
submission lifecycle — validation is synchronous, so a dedicated state
would be true for 0ms and rendered for no visible reason. I also kept the
donation service boundary deliberately minimal: no retry logic, no request
cancellation, no generic API client, since none of that has a real backend
to justify it yet. And the hero's rim facets trade DRYness for correctness —
five hardcoded keyframes instead of one shared, delay-staggered keyframe —
because the shared version is exactly what caused the bug above.`}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Results"}),`
`,n.jsx(e.p,{children:`This is a portfolio build, not a live fundraising product — there are no
real donors or donation totals to report. What I can state factually: the
app type-checks and lints clean, the production bundle is roughly 83KB of
JS and 15KB of CSS gzipped, and the full donation flow, focus management,
and reduced-motion behavior were verified end-to-end against the actual
deployed production build, not just the local dev server. Every
accessibility fix above was confirmed by inspecting real DOM/focus state
afterward, not assumed from the code.`}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Lessons Learned"}),`
`,n.jsxs(e.p,{children:[`The clearest lesson: a technique that verifies the mechanism — scrubbing
`,n.jsx(e.code,{children:"currentTime"}),`, reading the JSX — can still miss what the browser actually
renders on load. I now treat "watch the real, untouched page" as a mandatory
check, not a nice-to-have, especially around delay-based animation
staggering. The second: three unrelated-looking bugs (donation steps, form
validation, mobile menu) turned out to share one root cause. Naming that
pattern once was more valuable than patching each symptom separately.`]}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Future Improvements"}),`
`,n.jsxs(e.p,{children:[`The most consequential next step is a real backend behind
`,n.jsx(e.code,{children:"donationService.submitDonation"}),` — currently a single documented function
boundary — accepting the donor's name, address, amount, and screenshot, and
returning a submission status. That unlocks the rest: secure, non-public
storage for uploaded screenshots, an actual verification/admin review
workflow, and donor notifications once a submission is reviewed. None of
this exists today; the UI is intentionally careful never to imply otherwise.`]}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Gallery"}),`
`,`
`,n.jsxs(e.p,{children:[n.jsx(e.img,{src:w,alt:"Hero section with the Gathering Point animation"}),`
`,n.jsx(e.em,{children:"The signature animation: individual marks travel to a core and merge, each leaving a trace on its rim."})]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.img,{src:v,alt:"Donation payment step"}),`
`,n.jsx(e.em,{children:"Client-generated UPI QR code with the donor's exact amount pre-filled."})]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.img,{src:k,alt:"Confirmation form with screenshot upload"}),`
`,n.jsx(e.em,{children:"The confirmation form and its screenshot uploader, mid-validation."})]}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"References"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.a,{href:"https://www.w3.org/WAI/ARIA/apg/patterns/tabs/",children:"WAI-ARIA Authoring Practices — Tabs Pattern"})," — the spec that surfaced the testimonial navigation's ARIA mismatch during the accessibility audit."]}),`
`]})]})}function A(i={}){const{wrapper:e}=i.components||{};return e?n.jsx(e,{...i,children:n.jsx(r,{...i})}):r(i)}const I=Object.freeze(Object.defineProperty({__proto__:null,default:A,frontmatter:T},Symbol.toStringTag,{value:"Module"})),P=Object.assign({"/content/projects/clinical-data-pipeline/index.mdx":x,"/content/projects/production-line-scheduling-system/index.mdx":b,"/content/projects/sacrifice-one-pizza/index.mdx":I});function l(){return Object.entries(P).map(([i,e])=>{const d=i.split("/")[3],c=i.substring(0,i.lastIndexOf("/")),t={slug:d,...h(e.frontmatter),Component:e.default};return t.cover&&(t.cover=p(t.cover,c)),t})}function S(){return l().filter(i=>o(i.status)).sort((i,e)=>i.displayIndex.localeCompare(e.displayIndex))}function z(i){return l().find(e=>e.slug===i&&o(e.status))}function C(){return S().filter(i=>i.featured).sort((i,e)=>(i.featuredIndex??i.displayIndex).localeCompare(e.featuredIndex??e.displayIndex))}export{S as a,z as b,C as g};

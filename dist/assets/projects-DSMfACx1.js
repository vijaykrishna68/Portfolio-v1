import{j as n}from"./index-B0Jyot0z.js";import{r as s}from"./assets-BW8W_IzU.js";const u={type:"project",title:"Clinical Data Pipeline",description:"HIPAA-compliant ingestion pipeline for a healthtech startup, aggregating patient vitals from 12 IoT device types into a unified API consumed by clinicians and ML models in real time.",status:"published",publishedAt:"2023-06-01",tags:["Python","FastAPI","Apache Kafka","TimescaleDB","Docker"],year:"2022 – 2023",challenge:"Event sourcing architecture that supports historical replay for model training while maintaining the strict audit trail required for FDA compliance — without sacrificing real-time latency.",technologies:["Python","FastAPI","Apache Kafka","TimescaleDB","Docker"],impact:"Data latency dropped from 45 minutes to under 8 seconds for 1,200 daily active patients.",cover:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1400&h=900&fit=crop&auto=format&q=80",coverAlt:"Healthcare technology interface showing patient data",displayIndex:"02",displayLayout:"flip",featured:!1,role:"Backend Engineer",hook:"Every second of latency between a patient's heartbeat and a clinician's screen is a second of diagnostic blindness."};function o(i){const e={code:"code",h2:"h2",p:"p",strong:"strong",...i.components};return n.jsxs(n.Fragment,{children:[n.jsx(e.h2,{children:"Problem"}),`
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
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Event sourcing is only as good as your schema evolution story."})," Halfway through the project, one device type changed its packet structure in a firmware update. Because we stored the raw binary payload, we could replay historical events through a new adapter and backfill the normalization. Without that, we would have had a two-week gap in training data."]})]})}function p(i={}){const{wrapper:e}=i.components||{};return e?n.jsx(e,{...i,children:n.jsx(o,{...i})}):o(i)}const g=Object.freeze(Object.defineProperty({__proto__:null,default:p,frontmatter:u},Symbol.toStringTag,{value:"Module"})),m={type:"project",title:"Manufacturing Intelligence Platform",description:"A real-time production scheduling system that replaced manual Excel-based workflows across three factory floors. Processes 50,000+ scheduling events daily with sub-100ms response times.",status:"published",publishedAt:"2022-12-01",tags:["Go","PostgreSQL","Redis","gRPC","React"],year:"2021 – 2022",challenge:"Modeling complex constraint satisfaction — machines with maintenance windows, operators with shift constraints, materials with lead times — into a scheduling algorithm production managers could actually trust.",technologies:["Go","PostgreSQL","Redis","gRPC","React"],impact:"73% reduction in scheduling conflicts. 14 hours/week of manual replanning eliminated.",cover:"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1400&h=900&fit=crop&auto=format&q=80",coverAlt:"Software engineer working on industrial scheduling system",displayIndex:"01",displayLayout:"default",featured:!0,role:"Backend Engineer",hook:"Replacing Excel chaos with constraint-satisfaction scheduling on the factory floor."};function l(i){const e={em:"em",h2:"h2",p:"p",strong:"strong",...i.components};return n.jsxs(n.Fragment,{children:[n.jsx(e.h2,{children:"Problem"}),`
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
`,n.jsxs(e.p,{children:["We ended up building a ",n.jsx(e.strong,{children:"constraint capture UI"})," where overrides became named rules. The algorithm got better. Overrides decreased. The lesson: the model of the problem was incomplete, and the only way to complete it was to give users a way to express what the model missed."]})]})}function x(i={}){const{wrapper:e}=i.components||{};return e?n.jsx(e,{...i,children:n.jsx(l,{...i})}):l(i)}const f=Object.freeze(Object.defineProperty({__proto__:null,default:x,frontmatter:m},Symbol.toStringTag,{value:"Module"})),j={type:"project",slug:"production-line-scheduling-system",title:"Production Line Scheduling System",description:"A constraint-based scheduling platform that automated production planning for a manufacturing plant, reducing manual scheduling time from 4–5 days to around 30 minutes.",status:"published",publishedAt:"2026-06-30",tags:["React","Node.js","Express","MongoDB","Excel","Manufacturing","Scheduling","Algorithms"],cover:"./cover.png",coverAlt:"Dashboard showing production line scheduling and manufacturing metrics",year:"2025 – 2026",challenge:"Design a scheduling engine that could allocate thousands of manufacturing parts across multiple production lines while respecting production capacity, cycle times, business rules, and existing Excel-based workflows.",technologies:["React","Tailwind CSS","Node.js","Express.js","MongoDB","XLSX"],impact:"Reduced production planning time from 4–5 days to approximately 30 minutes while preserving the company's existing Excel workflow.",displayIndex:"01",displayLayout:"default",featured:!0,links:{github:"",live:"",writeup:""}};function c(i){const e={code:"code",em:"em",h2:"h2",h3:"h3",hr:"hr",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...i.components};return n.jsxs(n.Fragment,{children:[n.jsx(e.h2,{children:"Problem"}),`
`,n.jsx(e.p,{children:"The manufacturing plant planned production entirely through Excel spreadsheets."}),`
`,n.jsx(e.p,{children:"Every production cycle, planners manually reviewed customer orders, part specifications, production line capabilities, and cycle times before deciding where every part should be manufactured."}),`
`,n.jsx(e.p,{children:"The process involved:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Reviewing thousands of production quantities"}),`
`,n.jsx(e.li,{children:"Calculating production durations manually"}),`
`,n.jsx(e.li,{children:"Assigning parts across four production lines"}),`
`,n.jsx(e.li,{children:"Estimating production dates"}),`
`,n.jsx(e.li,{children:"Updating multiple worksheets"}),`
`]}),`
`,n.jsxs(e.p,{children:["A single scheduling cycle required ",n.jsx(e.strong,{children:"4–5 days of manual work by one planner"}),", making it difficult to respond quickly to changing production demands."]}),`
`,n.jsxs(e.p,{children:["The company needed a solution that automated scheduling ",n.jsx(e.strong,{children:"without forcing operators to abandon their existing Excel workflow"}),"."]}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Background"}),`
`,n.jsx(e.p,{children:"This project was developed as a freelance engagement for a manufacturing company within the Polyhose group that produces hose components for heavy-duty industrial machinery and commercial vehicles."}),`
`,n.jsx(e.p,{children:"The plant consisted of:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"4 production lines"}),`
`,n.jsx(e.li,{children:"Approximately 16 manufacturing machines"}),`
`,n.jsx(e.li,{children:"Around 50 employees per plant"}),`
`,n.jsx(e.li,{children:"Two production facilities"}),`
`]}),`
`,n.jsx(e.p,{children:"Production planning relied on a single master workbook containing multiple worksheets including customer orders, part specifications, production line information, and production performance metrics."}),`
`,n.jsx(e.p,{children:"Rather than replacing Excel with an ERP system, the objective was to build software that understood the existing workbook and generated optimized production schedules automatically."}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Constraints"}),`
`,n.jsx(e.p,{children:"Several practical constraints shaped the system architecture."}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Factory planners were already comfortable with Excel and could not be expected to learn an entirely new workflow."}),`
`,n.jsx(e.li,{children:"The generated schedule had to remain compatible with the company's existing spreadsheets."}),`
`,n.jsx(e.li,{children:"Production capacity varied between manufacturing lines."}),`
`,n.jsx(e.li,{children:"Different parts required different cycle times."}),`
`,n.jsx(e.li,{children:"Certain parts could only be manufactured on specific production lines."}),`
`,n.jsx(e.li,{children:"Sundays had to be excluded from scheduling."}),`
`,n.jsx(e.li,{children:"The scheduler needed to continue production across multiple working days while respecting production windows."}),`
`]}),`
`,n.jsx(e.p,{children:"These operational constraints made the scheduling logic significantly more complex than a simple allocation algorithm."}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Research"}),`
`,n.jsx(e.p,{children:"Before implementing the scheduler, I spent time understanding how production planning was performed manually."}),`
`,n.jsx(e.p,{children:"This involved studying:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Manufacturing workflows"}),`
`,n.jsx(e.li,{children:"Production capacity calculations"}),`
`,n.jsx(e.li,{children:"Cycle time estimation"}),`
`,n.jsx(e.li,{children:"Existing Excel templates"}),`
`,n.jsx(e.li,{children:"Business rules used by planners"}),`
`,n.jsx(e.li,{children:"Line priority strategies"}),`
`,n.jsx(e.li,{children:"Manufacturing constraints and fallback scenarios"}),`
`]}),`
`,n.jsx(e.p,{children:"Rather than attempting to create a mathematically optimal scheduler, I designed the engine to replicate the company's real operational decision-making process while dramatically reducing planning time."}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Architecture"}),`
`,n.jsx(e.p,{children:"The application converts an Excel workbook into an internal production model, performs capacity-aware scheduling, and generates a new workbook containing the completed production plan."}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-text",children:`                Manufacturing Workbook\r
                        │\r
                        ▼\r
              Workbook Validation\r
                        │\r
                        ▼\r
             Multi-Sheet XLSX Parser\r
                        │\r
                        ▼\r
      Internal Production Data Model\r
        (Parts, Lines, Capacity)\r
                        │\r
                        ▼\r
 Constraint-Based Scheduling Engine\r
                        │\r
        ┌───────────────┴───────────────┐\r
        │                               │\r
        ▼                               ▼\r
 MongoDB Schedule History      Workbook Generator\r
        │                               │\r
        └───────────────┬───────────────┘\r
                        ▼\r
                React Dashboard
`})}),`
`,n.jsx(e.p,{children:"The frontend provides dashboards, historical scheduling runs, file uploads, and production summaries while the backend performs scheduling and workbook generation."}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Technical Decisions"}),`
`,n.jsx(e.h3,{children:"Decision: Preserve the Excel workflow"}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Options considered"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Replace Excel with a database-driven planning system"}),`
`,n.jsx(e.li,{children:"Continue using Excel as the primary interface"}),`
`]}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Chosen"})}),`
`,n.jsx(e.p,{children:"Continue using Excel."}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Why"})}),`
`,n.jsx(e.p,{children:"The planners were already familiar with Excel and introducing a completely new workflow would have increased training costs and reduced adoption. Instead, the application adapts to the users' existing process while automating the most time-consuming work."}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h3,{children:"Decision: Generate a new workbook"}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Options considered"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Modify the uploaded workbook"}),`
`,n.jsx(e.li,{children:"Generate a completely new workbook"}),`
`]}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Chosen"})}),`
`,n.jsx(e.p,{children:"Generate a new workbook."}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Why"})}),`
`,n.jsx(e.p,{children:"Keeping the original workbook untouched provides an audit trail, prevents accidental data loss, and makes validation significantly easier."}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h3,{children:"Decision: Constraint-based scheduling"}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Options considered"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Allocate parts sequentially"}),`
`,n.jsx(e.li,{children:"Build a capacity-aware scheduling engine"}),`
`]}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Chosen"})}),`
`,n.jsx(e.p,{children:"Constraint-based scheduling."}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Why"})}),`
`,n.jsx(e.p,{children:"Production lines have different capacities, different supported operations, and different availability windows. The scheduler therefore considers production capacity, cycle time, line priority, fallback routing, and remaining production quantities before assigning work."}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Challenges"}),`
`,n.jsx(e.p,{children:"The scheduling algorithm was the most challenging part of the project."}),`
`,n.jsx(e.p,{children:"Some of the engineering challenges included:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Converting multiple Excel worksheets into a consistent in-memory production model."}),`
`,n.jsx(e.li,{children:"Tracking production capacity in minutes rather than simply counting quantities."}),`
`,n.jsx(e.li,{children:"Supporting fallback production lines when preferred lines reached capacity."}),`
`,n.jsx(e.li,{children:"Continuing production across multiple working days while excluding Sundays."}),`
`,n.jsx(e.li,{children:"Writing thousands of generated allocations back into a newly created workbook while preserving spreadsheet compatibility."}),`
`,n.jsx(e.li,{children:"Producing deterministic schedules that matched the company's manual planning process."}),`
`]}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Tradeoffs"}),`
`,n.jsx(e.p,{children:"The scheduler deliberately prioritizes predictability over theoretical optimization."}),`
`,n.jsx(e.p,{children:"Business-defined production priorities are respected even if another allocation could potentially produce a slightly better utilization rate."}),`
`,n.jsx(e.p,{children:"Similarly, retaining Excel as the primary interface increases parser complexity, but significantly improves adoption because planners continue using familiar tools."}),`
`,n.jsx(e.p,{children:"These tradeoffs favored operational reliability over architectural purity."}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Results"}),`
`,n.jsx(e.p,{children:"The system successfully automated production planning for the manufacturing plant."}),`
`,n.jsx(e.p,{children:"Measured outcomes included:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["Reduced production planning time from ",n.jsx(e.strong,{children:"4–5 days"})," to approximately ",n.jsx(e.strong,{children:"30 minutes"})]}),`
`,n.jsx(e.li,{children:"Automated allocation across four production lines"}),`
`,n.jsx(e.li,{children:"Automatic production date calculation"}),`
`,n.jsx(e.li,{children:"Capacity-aware scheduling using cycle times"}),`
`,n.jsx(e.li,{children:"Historical schedule tracking through a dashboard"}),`
`,n.jsx(e.li,{children:"Downloadable production workbooks compatible with existing company processes"}),`
`]}),`
`,n.jsx(e.p,{children:"The solution allowed planners to generate production schedules in minutes instead of spending several days performing manual calculations."}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Lessons Learned"}),`
`,n.jsx(e.p,{children:"This project fundamentally changed how I think about software engineering."}),`
`,n.jsx(e.p,{children:'Initially, I viewed the problem as "editing an Excel file."'}),`
`,n.jsx(e.p,{children:"In reality, the Excel workbook was only the user interface."}),`
`,n.jsx(e.p,{children:"The real challenge was modelling a manufacturing system, translating business rules into deterministic scheduling logic, and designing software that fit naturally into an existing operational workflow."}),`
`,n.jsx(e.p,{children:"I also learned that successful engineering is often about adapting technology to people rather than forcing people to adapt to technology."}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Future Improvements"}),`
`,n.jsx(e.p,{children:"Future iterations of the system would include:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"User authentication and role-based permissions"}),`
`,n.jsx(e.li,{children:"ERP integration for automatic order synchronization"}),`
`,n.jsx(e.li,{children:"Background job queues for large scheduling runs"}),`
`,n.jsx(e.li,{children:"Real-time machine availability"}),`
`,n.jsx(e.li,{children:"Automatic schedule rebalancing after production delays"}),`
`,n.jsx(e.li,{children:"Audit logs for production changes"}),`
`,n.jsx(e.li,{children:"REST APIs for integration with manufacturing execution systems (MES)"}),`
`]}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"Gallery"}),`
`,n.jsx(e.p,{children:n.jsx(e.img,{src:"./architecture.png",alt:"Architecture diagram"})}),`
`,n.jsx(e.p,{children:n.jsx(e.em,{children:"Constraint-based scheduling architecture showing workbook ingestion, scheduling engine, and workbook generation."})}),`
`,n.jsx(e.p,{children:n.jsx(e.img,{src:"./dashboard.png",alt:"Dashboard"})}),`
`,n.jsx(e.p,{children:n.jsx(e.em,{children:"Dashboard displaying production metrics, scheduling history, line utilization, and operational summaries."})}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.h2,{children:"References"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Microsoft Excel XLSX File Format — Used for workbook parsing and generation."}),`
`,n.jsx(e.li,{children:"Manufacturing Scheduling and Production Planning principles — Inspired the capacity-aware scheduling approach used in the allocation engine."}),`
`]})]})}function y(i={}){const{wrapper:e}=i.components||{};return e?n.jsx(e,{...i,children:n.jsx(c,{...i})}):c(i)}const w=Object.freeze(Object.defineProperty({__proto__:null,default:y,frontmatter:j},Symbol.toStringTag,{value:"Module"})),b=Object.assign({"/content/projects/clinical-data-pipeline/index.mdx":g,"/content/projects/manufacturing-intelligence-platform/index.mdx":f,"/content/projects/production-line-scheduling-system/index.mdx":w});function d(){return Object.entries(b).map(([i,e])=>{const h=i.split("/")[3],r=i.substring(0,i.lastIndexOf("/")),t={slug:h,...e.frontmatter,Component:e.default};return t.cover&&(t.cover=s(t.cover,r)),t.gallery&&(t.gallery=t.gallery.map(a=>({...a,src:s(a.src,r)}))),t})}function T(){return d().filter(i=>i.status==="published").sort((i,e)=>i.displayIndex.localeCompare(e.displayIndex))}function P(i){return d().find(e=>e.slug===i&&e.status==="published")}export{P as a,T as g};

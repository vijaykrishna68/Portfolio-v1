import{j as t}from"./index-Cbh2hl2S.js";import{r as h}from"./assets-BW8W_IzU.js";const u={type:"playground",title:"Browser Terminal",description:"A fully functional terminal emulator in a browser tab.",summary:"A fully functional terminal emulator in a browser tab.",status:"published",publishedAt:"2025-02-01",tags:["Prototype"],cover:"https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&h=500&fit=crop&auto=format&q=80",layout:{desktop:"col-start-3 col-span-1 row-start-1 row-span-1",mobile:"col-span-1 row-span-1"}};function s(n){const e={code:"code",h2:"h2",p:"p",pre:"pre",...n.components};return t.jsxs(t.Fragment,{children:[t.jsx(e.h2,{children:"Idea"}),`
`,t.jsx(e.p,{children:"I wanted to understand what a terminal emulator actually does — not just use one, but understand the VT100 escape code parsing, the PTY protocol, the difference between a terminal and a shell."}),`
`,t.jsx(e.p,{children:"Most developers use terminals daily and treat them as black boxes. I wanted to open the box."}),`
`,t.jsx(e.h2,{children:"Experiment"}),`
`,t.jsx(e.p,{children:"A WebSocket-backed terminal emulator using xterm.js for rendering and node-pty on the server side to spawn a real shell. The browser renders a real terminal; keypresses go over WebSocket to the server, which forwards them to the PTY; PTY output comes back over WebSocket and xterm.js renders it."}),`
`,t.jsx(e.p,{children:"The constraint: understand every layer, not just wire up libraries. I read the xterm.js source and the node-pty internals before writing a line of code."}),`
`,t.jsx(e.h2,{children:"Implementation"}),`
`,t.jsx(e.p,{children:"The interesting part was handling terminal resize. When the browser window resizes, the terminal must tell the PTY to resize:"}),`
`,t.jsx(e.pre,{children:t.jsx(e.code,{className:"language-typescript",children:`terminal.onResize(({ cols, rows }) => {
  ws.send(JSON.stringify({ type: 'resize', cols, rows }))
})

// Server side
ws.on('message', (data) => {
  const msg = JSON.parse(data)
  if (msg.type === 'resize') {
    pty.resize(msg.cols, msg.rows)
  }
})
`})}),`
`,t.jsx(e.p,{children:"Without this, programs that read terminal size (vim, htop, any TUI) render incorrectly because the PTY still thinks the terminal is 80×24."}),`
`,t.jsx(e.h2,{children:"Interesting Findings"}),`
`,t.jsxs(e.p,{children:["VT100 escape codes are wild. ",t.jsx(e.code,{children:"\\x1b[2J"})," clears the screen. ",t.jsx(e.code,{children:"\\x1b[?1049h"})," switches to the alternate screen buffer (what vim does when it opens). ",t.jsx(e.code,{children:"\\x1b[?1049l"})," switches back and restores the previous content."]}),`
`,t.jsx(e.p,{children:"Every time you open vim and close it without seeing your previous terminal output get corrupted, you're benefiting from the alternate screen buffer. I never thought about how that worked until I built this."})]})}function p(n={}){const{wrapper:e}=n.components||{};return e?t.jsx(e,{...n,children:t.jsx(s,{...n})}):s(n)}const m=Object.freeze(Object.defineProperty({__proto__:null,default:p,frontmatter:u},Symbol.toStringTag,{value:"Module"})),y={type:"playground",title:"DNS Resolution Explainer",description:"Step-by-step walkthrough of how a DNS query resolves across the internet.",summary:"Step-by-step walkthrough of how a DNS query resolves across the internet.",status:"published",publishedAt:"2025-04-01",tags:["Explainer"],cover:"https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=900&h=450&fit=crop&auto=format&q=80",layout:{desktop:"col-start-3 col-span-2 row-start-2 row-span-1",mobile:"col-span-2 row-span-1"}};function o(n){const e={code:"code",h2:"h2",p:"p",pre:"pre",...n.components};return t.jsxs(t.Fragment,{children:[t.jsx(e.h2,{children:"Idea"}),`
`,t.jsx(e.p,{children:"Type a URL into a browser. Something happens. 50ms later, a connection is established. What happened?"}),`
`,t.jsx(e.p,{children:"I knew the vocabulary — recursive resolver, root nameserver, TLD nameserver, authoritative nameserver — but I couldn't fluently explain the handoffs. I wanted to build something that made the handoffs visible."}),`
`,t.jsx(e.h2,{children:"Experiment"}),`
`,t.jsx(e.p,{children:"An animated diagram that simulates a DNS resolution for any domain you enter. Each step in the resolution chain is animated in sequence: the stub resolver contacts the recursive resolver, which checks its cache, then queries the root servers, then the TLD servers, then the authoritative nameserver."}),`
`,t.jsx(e.p,{children:"Each hop shows the actual DNS message types (A, AAAA, NS, CNAME) and the TTL values returned."}),`
`,t.jsx(e.h2,{children:"Implementation"}),`
`,t.jsx(e.p,{children:"The simulation uses a real DoH (DNS over HTTPS) API to resolve the domain, then animates the steps in sequence based on the response data. The animation timeline is built from the intermediate resolution steps:"}),`
`,t.jsx(e.pre,{children:t.jsx(e.code,{className:"language-typescript",children:`async function resolveWithSteps(domain: string): Promise<ResolutionStep[]> {
  const steps: ResolutionStep[] = []

  // Query root → returns NS records for TLD
  const tldNS = await queryDNS(ROOT_SERVERS[0], domain, 'NS')
  steps.push({ from: 'resolver', to: 'root', query: domain, response: tldNS })

  // Query TLD nameserver → returns NS records for domain
  const domainNS = await queryDNS(tldNS.nameserver, domain, 'NS')
  steps.push({ from: 'resolver', to: 'tld', query: domain, response: domainNS })

  // Query authoritative nameserver → returns A record
  const aRecord = await queryDNS(domainNS.nameserver, domain, 'A')
  steps.push({ from: 'resolver', to: 'auth', query: domain, response: aRecord })

  return steps
}
`})}),`
`,t.jsx(e.h2,{children:"Interesting Findings"}),`
`,t.jsx(e.p,{children:"TTL values are fascinating when you watch them. The root zone's NS records have TTL of 518400 (6 days). Most TLD nameserver records have TTL of 172800 (2 days). Authoritative A records vary wildly — some CDNs use TTL of 60 seconds for fast failover, some small sites use 86400 (24 hours)."}),`
`,t.jsx(e.p,{children:'You can literally see the difference between "this site cares about fast DNS failover" and "this site changes its IP address never."'}),`
`,t.jsx(e.p,{children:"The other thing that becomes obvious: DNS is almost entirely cache hits. A busy recursive resolver might have millions of cached entries. Most domains you visit have their IP cached from someone else's query. The full resolution chain is surprisingly rare in practice."})]})}function g(n={}){const{wrapper:e}=n.components||{};return e?t.jsx(e,{...n,children:t.jsx(o,{...n})}):o(n)}const f=Object.freeze(Object.defineProperty({__proto__:null,default:g,frontmatter:y},Symbol.toStringTag,{value:"Module"})),x={type:"playground",title:"Graph Explorer",description:"Interactive BFS and DFS on user-defined graphs.",summary:"Interactive BFS and DFS on user-defined graphs.",status:"published",publishedAt:"2025-03-01",tags:["Algorithm"],cover:"https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&h=500&fit=crop&auto=format&q=80",layout:{desktop:"col-start-4 col-span-1 row-start-1 row-span-1",mobile:"col-span-1 row-span-1"}};function a(n){const e={code:"code",h2:"h2",p:"p",pre:"pre",...n.components};return t.jsxs(t.Fragment,{children:[t.jsx(e.h2,{children:"Idea"}),`
`,t.jsx(e.p,{children:"Graph algorithms are easy to understand from pseudocode but hard to intuit until you've watched them run on a graph you built yourself."}),`
`,t.jsx(e.p,{children:'BFS and DFS have fundamentally different "personalities" — BFS is methodical, expanding like a wavefront; DFS is exploratory, committing deeply before backtracking. I wanted to see this visually on graphs where I knew the structure.'}),`
`,t.jsx(e.h2,{children:"Experiment"}),`
`,t.jsx(e.p,{children:"A drag-to-connect node editor backed by a force-directed layout algorithm. You place nodes, draw edges, then pick an algorithm and watch it traverse step by step. The queue/stack state is shown alongside the graph so you can see the data structure driving the traversal."}),`
`,t.jsx(e.h2,{children:"Implementation"}),`
`,t.jsx(e.p,{children:"Force-directed layouts use a physics simulation: nodes repel each other (Coulomb's law), edges attract connected nodes (Hooke's law). The simulation runs until energy drops below a threshold:"}),`
`,t.jsx(e.pre,{children:t.jsx(e.code,{className:"language-typescript",children:`function tick(nodes: Node[], edges: Edge[]) {
  // Repulsion between all pairs
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[j].x - nodes[i].x
      const dy = nodes[j].y - nodes[i].y
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      const force = REPULSION / (dist * dist)
      nodes[i].vx -= force * dx / dist
      nodes[j].vx += force * dx / dist
      // ... same for vy
    }
  }
  // Attraction along edges
  for (const { source, target } of edges) {
    const dx = target.x - source.x
    const force = ATTRACTION * dx
    source.vx += force
    target.vx -= force
  }
}
`})}),`
`,t.jsx(e.p,{children:"The O(n²) repulsion loop is the bottleneck. For graphs over ~200 nodes, I'd replace it with a Barnes-Hut approximation, but for interactive exploration with under 50 nodes it's fine."}),`
`,t.jsx(e.h2,{children:"Interesting Findings"}),`
`,t.jsx(e.p,{children:"DFS on a graph with many cycles looks dramatically different from DFS on a tree. In a tree, DFS commits and backtracks cleanly. In a cyclic graph, the visited-set check causes it to skip edges in ways that look arbitrary until you trace the order of discovery."}),`
`,t.jsx(e.p,{children:'BFS is always more readable visually — the wavefront expansion makes the concept of "graph distance" concrete. You can see that all nodes at distance 2 are discovered before any node at distance 3.'})]})}function b(n={}){const{wrapper:e}=n.components||{};return e?t.jsx(e,{...n,children:t.jsx(a,{...n})}):a(n)}const j=Object.freeze(Object.defineProperty({__proto__:null,default:b,frontmatter:x},Symbol.toStringTag,{value:"Module"})),v={type:"playground",title:"Sorting Algorithm Visualizer",description:"Watch bubble sort, quicksort, and merge sort compete in real-time.",summary:"Watch bubble sort, quicksort, and merge sort compete in real-time.",status:"published",publishedAt:"2025-01-01",tags:["Visualization"],cover:"https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=700&fit=crop&auto=format&q=80",layout:{desktop:"col-start-1 col-span-2 row-start-1 row-span-2",mobile:"col-span-2 row-span-2"}};function i(n){const e={code:"code",em:"em",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...n.components};return t.jsxs(t.Fragment,{children:[t.jsx(e.h2,{children:"Idea"}),`
`,t.jsx(e.p,{children:"I could never intuitively feel why quicksort is faster than bubble sort on average until I watched them run side-by-side on the same array."}),`
`,t.jsxs(e.p,{children:["Reading the time complexity analysis tells you that quicksort is O(n log n) average and O(n²) worst case. Watching quicksort partition an array while bubble sort laboriously bubbles its way through the same data makes you ",t.jsx(e.em,{children:"feel"})," the difference in a way that no asymptotic analysis does."]}),`
`,t.jsx(e.h2,{children:"Experiment"}),`
`,t.jsx(e.p,{children:"Built a canvas-based renderer that runs multiple sort algorithms simultaneously on identical copies of a shuffled array. The array is rendered as a bar chart; bars swap colors as they're compared or swapped."}),`
`,t.jsx(e.p,{children:"Constraints I set:"}),`
`,t.jsxs(e.ul,{children:[`
`,t.jsx(e.li,{children:"No external visualization libraries — raw canvas API only"}),`
`,t.jsx(e.li,{children:'All algorithms run at the same "step rate" so the comparison is fair'}),`
`,t.jsx(e.li,{children:"The visualizer pauses when a tab loses focus to avoid drift"}),`
`]}),`
`,t.jsx(e.h2,{children:"Implementation"}),`
`,t.jsx(e.p,{children:"The trickiest part was threading the sort algorithms as generators so they yield on each comparison, allowing the visualizer to advance one step at a time:"}),`
`,t.jsx(e.pre,{children:t.jsx(e.code,{className:"language-typescript",children:`function* bubbleSort(arr: number[]): Generator<SortState> {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      yield { comparing: [j, j + 1], arr: [...arr] }
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        yield { swapping: [j, j + 1], arr: [...arr] }
      }
    }
  }
}
`})}),`
`,t.jsxs(e.p,{children:["Each ",t.jsx(e.code,{children:"yield"})," is one frame. The animation loop calls ",t.jsx(e.code,{children:".next()"})," on each generator and redraws."]}),`
`,t.jsx(e.h2,{children:"Interesting Findings"}),`
`,t.jsx(e.p,{children:"Merge sort's memory access pattern is visually obvious — you see it building sorted halves and merging them. Quicksort's partition step looks chaotic but resolves faster. Bubble sort is painful to watch after the first 20 elements."}),`
`,t.jsxs(e.p,{children:["The visual that surprised me most: insertion sort is ",t.jsx(e.em,{children:"fast"})," on nearly-sorted arrays. Faster than quicksort in some cases. You can see it — insertion sort barely moves elements when the array is almost sorted, while quicksort still does the full partition dance."]})]})}function w(n={}){const{wrapper:e}=n.components||{};return e?t.jsx(e,{...n,children:t.jsx(i,{...n})}):i(n)}const S=Object.freeze(Object.defineProperty({__proto__:null,default:w,frontmatter:v},Symbol.toStringTag,{value:"Module"})),T=Object.assign({"/content/playground/browser-terminal/index.mdx":m,"/content/playground/dns-resolution-explainer/index.mdx":f,"/content/playground/graph-explorer/index.mdx":j,"/content/playground/sorting-algorithm-visualizer/index.mdx":S});function l(){return Object.entries(T).map(([n,e])=>{const c=n.split("/")[3],d=n.substring(0,n.lastIndexOf("/")),r={slug:c,...e.frontmatter,Component:e.default};return r.cover&&(r.cover=h(r.cover,d)),r})}function I(){return l().filter(n=>n.status==="published")}function N(n){return l().find(e=>e.slug===n&&e.status==="published")}export{N as a,I as g};

import{j as n}from"./index-B0Jyot0z.js";import{r as c}from"./assets-BW8W_IzU.js";function _(t){const e=new Date(t);return isNaN(e.getTime())?t:e.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}const u={type:"journal",title:"Understanding B-Trees From First Principles",description:"Why databases use B-Trees for indexes, starting from binary search trees and building up to why they win at disk I/O.",excerpt:"Why databases use B-Trees for indexes, starting from binary search trees and building up to why they win at disk I/O.",status:"published",publishedAt:"2025-05-03",tags:["Databases"],readTime:"12 min",featured:!1};function o(t){const e={code:"code",em:"em",h2:"h2",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...t.components};return n.jsxs(n.Fragment,{children:[n.jsxs(e.p,{children:["I spent years knowing that databases use B-Trees for indexes without actually understanding ",n.jsx(e.em,{children:"why"}),`. "It's efficient" isn't an explanation. Here's the one I wish I had earlier.`]}),`
`,n.jsx(e.h2,{children:"Start With Binary Search Trees"}),`
`,n.jsx(e.p,{children:"A binary search tree (BST) gives you O(log n) search because at each node, you eliminate half the remaining candidates. A sorted array of 1 million integers requires at most 20 comparisons to find any element."}),`
`,n.jsx(e.p,{children:"So why don't databases use BSTs for indexes?"}),`
`,n.jsxs(e.p,{children:["Two reasons: ",n.jsx(e.strong,{children:"balance"})," and ",n.jsx(e.strong,{children:"disk I/O"}),"."]}),`
`,n.jsx(e.p,{children:"A BST can become pathologically unbalanced. Insert a sorted sequence and you get a linked list. Self-balancing BSTs (AVL trees, red-black trees) solve this, but they don't solve the second problem."}),`
`,n.jsx(e.h2,{children:"The Disk I/O Problem"}),`
`,n.jsxs(e.p,{children:["Modern databases store data on disk. Reading from disk is roughly ",n.jsx(e.strong,{children:"100,000× slower"})," than reading from RAM. The fundamental unit of disk access is a ",n.jsx(e.strong,{children:"page"})," — typically 4KB or 16KB — not a single byte. When you read a node from disk, you read the entire page whether you needed one byte or 4,000 bytes."]}),`
`,n.jsx(e.p,{children:"A BST node stores one key and two pointers. On disk, that's maybe 24 bytes out of a 4KB page. You're using less than 1% of each page you read. And traversing a BST with a million nodes might require 20 page reads — 20 round trips to disk."}),`
`,n.jsx(e.p,{children:"This is the insight that leads to B-Trees."}),`
`,n.jsx(e.h2,{children:"The B-Tree Insight"}),`
`,n.jsxs(e.p,{children:["What if each node stored ",n.jsx(e.em,{children:"many"})," keys instead of one?"]}),`
`,n.jsxs(e.p,{children:["A B-Tree node stores up to ",n.jsx(e.code,{children:"2t - 1"})," keys (where ",n.jsx(e.code,{children:"t"})," is the minimum degree, chosen to fill a page). A node with 100 keys has 101 child pointers. The tree is extraordinarily wide and extraordinarily shallow."]}),`
`,n.jsxs(e.p,{children:["A B-Tree with ",n.jsx(e.code,{children:"t = 100"})," and 1 million records has height at most ",n.jsx(e.strong,{children:"3"}),". Finding any record requires at most 3 page reads — 3 disk accesses — instead of 20."]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{children:`Height = ceil(log_t(n))
t = 100, n = 1,000,000 → height = ceil(log_100(1,000,000)) = ceil(3) = 3
`})}),`
`,n.jsx(e.p,{children:"Each page read is expensive, but you read far fewer pages. The tree is designed around the cost model of the storage layer."}),`
`,n.jsx(e.h2,{children:"Insertions and the Split Invariant"}),`
`,n.jsxs(e.p,{children:["B-Trees maintain balance through ",n.jsx(e.strong,{children:"splits"}),". When a node fills up (reaches ",n.jsx(e.code,{children:"2t - 1"})," keys), it splits into two nodes of ",n.jsx(e.code,{children:"t - 1"})," keys each, and the median key moves up to the parent."]}),`
`,n.jsxs(e.p,{children:["This is where B-Trees get clever: the split is done ",n.jsx(e.strong,{children:"on the way down"})," during insertion, not after the fact. When you traverse down to insert a key, you pre-emptively split any full nodes you encounter. This means the parent always has room to accept the median key from a split child — no backtracking required."]}),`
`,n.jsxs(e.p,{children:["The invariant: every node except the root has between ",n.jsx(e.code,{children:"t - 1"})," and ",n.jsx(e.code,{children:"2t - 1"})," keys. The root has between 1 and ",n.jsx(e.code,{children:"2t - 1"})," keys."]}),`
`,n.jsx(e.h2,{children:"B+ Trees: What PostgreSQL Actually Uses"}),`
`,n.jsxs(e.p,{children:["PostgreSQL, MySQL, SQLite, and most databases use ",n.jsx(e.strong,{children:"B+ Trees"})," rather than B-Trees. The difference:"]}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"In a B-Tree, keys appear in internal nodes and leaf nodes. A search might terminate at an internal node."}),`
`,n.jsxs(e.li,{children:["In a B+ Tree, ",n.jsx(e.strong,{children:"all keys appear in leaf nodes"}),". Internal nodes contain only routing keys. Leaf nodes are linked in a doubly-linked list."]}),`
`]}),`
`,n.jsxs(e.p,{children:["The linked list of leaf nodes is the critical feature. It makes ",n.jsx(e.strong,{children:"range scans"})," efficient: find the leftmost matching key, then follow the linked list until the range is exhausted. No backtracking up the tree."]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-sql",children:`-- This range scan traverses the leaf linked list, not the full tree
SELECT * FROM orders WHERE created_at BETWEEN '2025-01-01' AND '2025-03-31'
`})}),`
`,n.jsx(e.h2,{children:"What This Means for Index Design"}),`
`,n.jsx(e.p,{children:"Understanding B+ Trees makes index design intuitive rather than cargo-culted:"}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Prefix queries use indexes, arbitrary substring queries don't."})," The B+ Tree is sorted. ",n.jsx(e.code,{children:"WHERE name LIKE 'John%'"})," can use an index because you find 'John' in the leaf list and scan forward. ",n.jsx(e.code,{children:"WHERE name LIKE '%ohn%'"})," can't because there's no contiguous range to scan."]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Composite index column order matters."})," Index ",n.jsx(e.code,{children:"(last_name, first_name)"}),". A query filtering on ",n.jsx(e.code,{children:"last_name"})," alone uses the index. A query filtering on ",n.jsx(e.code,{children:"first_name"})," alone doesn't — there's no contiguous range of ",n.jsx(e.code,{children:"first_name"})," values in the tree because the primary sort key is ",n.jsx(e.code,{children:"last_name"}),"."]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Index scans beat sequential scans at high selectivity, not low selectivity."})," If your query matches 80% of the table, the planner correctly prefers a sequential scan: following 80% of the leaf pointers and doing random I/O is slower than just reading the table sequentially."]}),`
`,n.jsx(e.p,{children:"The B-Tree is a beautiful piece of engineering. Once you understand what problem it's solving — minimizing disk I/O given a specific cost model — everything about its design follows logically."})]})}function p(t={}){const{wrapper:e}=t.components||{};return e?n.jsx(e,{...t,children:n.jsx(o,{...t})}):o(t)}const x=Object.freeze(Object.defineProperty({__proto__:null,default:p,frontmatter:u},Symbol.toStringTag,{value:"Module"})),g={type:"journal",title:"Designing Better APIs",description:"Predictable naming, consistent errors, and the principle of least surprise — what separates a good API from a painful one.",excerpt:"Predictable naming, consistent errors, and the principle of least surprise — what separates a good API from a painful one.",status:"published",publishedAt:"2025-04-19",tags:["Architecture"],readTime:"6 min",featured:!1};function i(t){const e={code:"code",h2:"h2",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...t.components};return n.jsxs(n.Fragment,{children:[n.jsx(e.p,{children:"I've integrated with a lot of APIs. Some of them I think about fondly. Most of them I have repressed."}),`
`,n.jsx(e.p,{children:"The difference between a good API and a bad one is rarely about technical complexity. It's almost always about the designer's willingness to make decisions on behalf of the caller."}),`
`,n.jsx(e.h2,{children:"Predictability Over Cleverness"}),`
`,n.jsx(e.p,{children:"The best APIs are boring. Every endpoint does exactly what its name suggests. Every response has the same shape. Every error looks like every other error."}),`
`,n.jsx(e.p,{children:"The worst APIs are creative. Endpoints have names that made sense to the original developer but require reading the docs (or the source code) to understand. Responses have slightly different shapes depending on whether the request succeeded, failed, or partially succeeded. Errors are sometimes strings, sometimes objects, sometimes HTTP status codes with no body."}),`
`,n.jsx(e.p,{children:"Predictability is a feature. When a developer can guess how your API behaves without reading the docs, they're faster and they make fewer mistakes."}),`
`,n.jsx(e.h2,{children:"The Error Contract"}),`
`,n.jsxs(e.p,{children:["Most APIs I've worked with have inconsistent error handling. Some return ",n.jsx(e.code,{children:'{ "error": "message" }'}),". Some return ",n.jsx(e.code,{children:'{ "message": "error" }'}),". Some return plain strings. Some throw 500s for things that aren't server errors."]}),`
`,n.jsx(e.p,{children:"A good error contract:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-json",children:`{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The 'email' field is required.",
    "field": "email"
  }
}
`})}),`
`,n.jsxs(e.p,{children:["Every error has the same shape. The ",n.jsx(e.code,{children:"code"})," field is a machine-readable string that the caller can switch on without parsing the ",n.jsx(e.code,{children:"message"}),". The ",n.jsx(e.code,{children:"message"})," is human-readable and safe to surface to users. Optional ",n.jsx(e.code,{children:"field"})," for validation errors."]}),`
`,n.jsx(e.p,{children:"The HTTP status code carries semantic meaning:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"400"})," — caller did something wrong"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"401"})," — authentication required"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"403"})," — authenticated but not authorized"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"404"})," — resource doesn't exist"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"422"})," — request is valid but semantically wrong"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"429"})," — rate limited"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"5xx"})," — our fault, not yours"]}),`
`]}),`
`,n.jsxs(e.p,{children:[n.jsxs(e.strong,{children:["Never return ",n.jsx(e.code,{children:"200"})," with an error in the body."]})," I see this constantly. It forces callers to check two things: the HTTP status and the response body. Status codes exist precisely so callers don't have to parse the body to know if the request succeeded."]}),`
`,n.jsx(e.h2,{children:"Idempotency"}),`
`,n.jsx(e.p,{children:"Any operation that creates or modifies state should be idempotent — calling it twice produces the same result as calling it once."}),`
`,n.jsx(e.p,{children:"The practical pattern: accept an idempotency key in a header. If you've seen this key before, return the original response. Don't execute the operation again."}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{children:`POST /api/payments
Idempotency-Key: 4d2f1e9a-7c3b-4a8e-b612-9f0e1d5c3b2a
`})}),`
`,n.jsx(e.p,{children:"Network failures are a fact of life. Callers retry. Without idempotency, a retry that arrives after the server processed the first request creates a duplicate. With idempotency, the retry is safe."}),`
`,n.jsx(e.h2,{children:"Versioning Up Front"}),`
`,n.jsxs(e.p,{children:["Add API versioning before you have multiple versions. The cost of adding ",n.jsx(e.code,{children:"/v1/"})," to every URL path is zero. The cost of adding versioning after you have callers in production is enormous — you have to maintain backward compatibility forever or break every existing integration."]}),`
`,n.jsx(e.p,{children:"Two patterns that work:"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"URL path versioning"}),": ",n.jsx(e.code,{children:"/v1/users"}),", ",n.jsx(e.code,{children:"/v2/users"}),". Simple, visible, cacheable."]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Header versioning"}),": ",n.jsx(e.code,{children:"Accept: application/vnd.api+json;version=1"}),". More RESTful, less visible."]}),`
`]}),`
`,n.jsx(e.p,{children:"I prefer URL path versioning. It's immediately obvious from a log line which version a request used."}),`
`,n.jsx(e.h2,{children:"The Principle of Least Surprise"}),`
`,n.jsx(e.p,{children:"When in doubt, ask: what would a developer who has never seen this API before expect this endpoint to do?"}),`
`,n.jsx(e.p,{children:"If the answer is different from what the endpoint actually does, that's a design problem. Good API design is empathy applied to a technical interface."})]})}function m(t={}){const{wrapper:e}=t.components||{};return e?n.jsx(e,{...t,children:n.jsx(i,{...t})}):i(t)}const j=Object.freeze(Object.defineProperty({__proto__:null,default:m,frontmatter:g},Symbol.toStringTag,{value:"Module"})),f={type:"journal",title:"The Hidden Cost of React Context",description:"Context is a great concept but a frequent performance trap. Here's why it re-renders more than you expect, and what to reach for when your component tree grows.",excerpt:"Context is a great concept but a frequent performance trap. Here's why it re-renders more than you expect, and what to reach for when your component tree grows.",status:"published",publishedAt:"2025-06-12",tags:["Frontend"],readTime:"8 min",featured:!0};function a(t){const e={code:"code",h2:"h2",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...t.components};return n.jsxs(n.Fragment,{children:[n.jsx(e.p,{children:"React Context is one of those APIs that looks simple, performs simply, and then silently destroys your app's performance once your component tree grows past a certain size."}),`
`,n.jsx(e.p,{children:`I've seen this pattern repeatedly: a team reaches for Context because it's the "React way" to share state, ships without profiling, and discovers six months later that every keystroke in a search input causes 40 components to re-render.`}),`
`,n.jsx(e.p,{children:"Here's why it happens, and what to do about it."}),`
`,n.jsx(e.h2,{children:"How Context Actually Works"}),`
`,n.jsx(e.p,{children:`The React docs describe Context as a way to "pass data through the component tree without having to pass props down manually at every level." That's true. What the docs don't emphasize is the re-render behavior.`}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Every consumer of a Context re-renders whenever the Context value changes."})}),`
`,n.jsx(e.p,{children:"This is the whole sentence. There are no exceptions. React does not do a deep equality check. React does not check whether the specific part of the value your component uses has changed. If the object reference changes — which happens on every re-render of the provider — every consumer re-renders."}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`const ThemeContext = React.createContext({ theme: 'light', user: null })

function App() {
  const [theme, setTheme] = useState('light')
  const [user, setUser] = useState(null)

  // This object is created on every render of App.
  // Every consumer re-renders whenever App re-renders.
  return (
    <ThemeContext.Provider value={{ theme, user }}>
      <DeepTree />
    </ThemeContext.Provider>
  )
}
`})}),`
`,n.jsxs(e.p,{children:["Every render of ",n.jsx(e.code,{children:"App"})," creates a new ",n.jsx(e.code,{children:"{ theme, user }"})," object. New object reference means new Context value. Every ",n.jsx(e.code,{children:"useContext(ThemeContext)"})," consumer re-renders, regardless of whether ",n.jsx(e.code,{children:"theme"})," or ",n.jsx(e.code,{children:"user"})," changed."]}),`
`,n.jsx(e.h2,{children:"The Fix You Reach For First (And Why It's Often Wrong)"}),`
`,n.jsxs(e.p,{children:["The obvious fix is ",n.jsx(e.code,{children:"useMemo"}),":"]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`const value = useMemo(() => ({ theme, user }), [theme, user])
return <ThemeContext.Provider value={value}>
`})}),`
`,n.jsxs(e.p,{children:["This works! Until it doesn't. ",n.jsx(e.code,{children:"useMemo"})," stabilizes the reference when ",n.jsx(e.code,{children:"theme"})," and ",n.jsx(e.code,{children:"user"})," don't change. But any component that uses ",n.jsx(e.code,{children:"useContext(ThemeContext)"})," will still re-render when either ",n.jsx(e.code,{children:"theme"})," or ",n.jsx(e.code,{children:"user"})," changes — even if that component only cares about ",n.jsx(e.code,{children:"theme"}),"."]}),`
`,n.jsxs(e.p,{children:["If your ",n.jsx(e.code,{children:"UserAvatar"})," component calls ",n.jsx(e.code,{children:"useContext(ThemeContext)"})," to get ",n.jsx(e.code,{children:"user"}),", it re-renders whenever ",n.jsx(e.code,{children:"theme"})," changes. Every time."]}),`
`,n.jsx(e.h2,{children:"Context Splitting"}),`
`,n.jsxs(e.p,{children:["The correct solution for most cases is ",n.jsx(e.strong,{children:"context splitting"}),": separate contexts for values that change independently."]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`const ThemeContext = React.createContext('light')
const UserContext = React.createContext(null)

function App() {
  const [theme, setTheme] = useState('light')
  const [user, setUser] = useState(null)

  return (
    <ThemeContext.Provider value={theme}>
      <UserContext.Provider value={user}>
        <DeepTree />
      </UserContext.Provider>
    </ThemeContext.Provider>
  )
}
`})}),`
`,n.jsxs(e.p,{children:["Now ",n.jsx(e.code,{children:"UserAvatar"})," only subscribes to ",n.jsx(e.code,{children:"UserContext"}),". A theme change doesn't touch it."]}),`
`,n.jsx(e.h2,{children:"When Context Is the Wrong Tool Entirely"}),`
`,n.jsxs(e.p,{children:["Context is designed for ",n.jsx(e.strong,{children:"low-frequency, wide-reach"})," data: the current user, the active theme, the locale. It's not designed for state that changes on user interaction."]}),`
`,n.jsx(e.p,{children:"If you're putting shopping cart state, filter state, or any UI state that changes on keystrokes into Context — stop. Use a state manager designed for this: Zustand, Jotai, or even a well-structured useReducer with prop drilling for the relevant subtree."}),`
`,n.jsx(e.p,{children:"The performance model of these libraries is different. Zustand subscriptions are selector-based: a component only re-renders when the slice of state it selected changes, not when any state changes."}),`
`,n.jsx(e.h2,{children:"What I Actually Do"}),`
`,n.jsx(e.p,{children:"For a new project, my default setup:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Theme, locale, auth"})," → Context (rarely changes, needed everywhere)"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"UI state"})," → local ",n.jsx(e.code,{children:"useState"})," or lifted state as high as needed (not global)"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Server data"})," → React Query or SWR (handles caching, deduplication, and re-validation)"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Complex shared UI state"})," → Zustand, Jotai, or XState depending on complexity"]}),`
`]}),`
`,n.jsx(e.p,{children:"The rule of thumb: if the state changes when a user types or clicks, it probably doesn't belong in Context."})]})}function y(t={}){const{wrapper:e}=t.components||{};return e?n.jsx(e,{...t,children:n.jsx(a,{...t})}):a(t)}const b=Object.freeze(Object.defineProperty({__proto__:null,default:y,frontmatter:f},Symbol.toStringTag,{value:"Module"})),v={type:"journal",title:"Why HashMaps Feel Magical",description:"From hash functions to collision resolution — a peek under the hood of one of computing's most elegant structures.",excerpt:"From hash functions to collision resolution — a peek under the hood of one of computing's most elegant structures.",status:"published",publishedAt:"2025-03-07",tags:["CS Fundamentals"],readTime:"7 min",featured:!1};function h(t){const e={code:"code",h2:"h2",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...t.components};return n.jsxs(n.Fragment,{children:[n.jsx(e.p,{children:"HashMaps feel magical. You put a thing in, you get a thing out, and it's O(1) both ways. The magic disappears the moment you understand how they work — and once it disappears, you appreciate them even more."}),`
`,n.jsx(e.h2,{children:"The Core Idea"}),`
`,n.jsx(e.p,{children:"A HashMap is a key-value store backed by an array. The trick is computing an array index from a key in O(1) time, without scanning the array."}),`
`,n.jsxs(e.p,{children:["The function that does this is a ",n.jsx(e.strong,{children:"hash function"}),":"]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{children:`index = hash(key) % array_length
`})}),`
`,n.jsx(e.p,{children:"A good hash function:"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsx(e.li,{children:"Always produces the same output for the same input"}),`
`,n.jsx(e.li,{children:"Distributes outputs uniformly across the range"}),`
`,n.jsx(e.li,{children:"Is fast to compute"}),`
`]}),`
`,n.jsx(e.p,{children:"String hashing is a classic example. DJB2:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-python",children:`def djb2(s: str) -> int:
    h = 5381
    for c in s:
        h = ((h << 5) + h) + ord(c)
    return h & 0xFFFFFFFF
`})}),`
`,n.jsxs(e.p,{children:["The constants ",n.jsx(e.code,{children:"5381"})," and ",n.jsx(e.code,{children:"33"})," are empirically chosen to produce good distribution for ASCII strings. The result is an integer you can mod against your array length to get an index."]}),`
`,n.jsx(e.h2,{children:"Collisions Are Inevitable"}),`
`,n.jsx(e.p,{children:"By the pigeonhole principle, if you're mapping a large key space (all possible strings) to a small index space (array of 1,000 slots), collisions are mathematically guaranteed. Two different keys will hash to the same index."}),`
`,n.jsx(e.p,{children:"There are two main strategies for handling this:"}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Chaining."})," Each slot holds a linked list. On collision, append to the list. Lookup scans the list at the slot."]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Open addressing."})," On collision, probe for the next empty slot. Linear probing: check slot+1, slot+2, etc. until empty. Lookup follows the same probe sequence until it finds the key or an empty slot."]}),`
`,n.jsx(e.p,{children:"Most production HashMaps use chaining or a variant of open addressing. Python's dict uses open addressing with pseudo-random probing. Java's HashMap uses chaining."}),`
`,n.jsx(e.h2,{children:"Load Factor and Rehashing"}),`
`,n.jsxs(e.p,{children:["As you add entries, collisions become more frequent. The ",n.jsx(e.strong,{children:"load factor"})," is the ratio of entries to array slots:"]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{children:`load_factor = num_entries / array_capacity
`})}),`
`,n.jsxs(e.p,{children:["When load factor exceeds a threshold (typically 0.7–0.75), the HashMap ",n.jsx(e.strong,{children:"rehashes"}),": allocates a new array (usually 2× larger) and reinserts all entries. This is O(n) — but it happens so infrequently that the amortized cost per insertion is still O(1)."]}),`
`,n.jsx(e.p,{children:'This is why saying HashMaps are O(1) is technically "amortized O(1)." Individual insertions near a rehash are O(n). The average across all insertions is O(1).'}),`
`,n.jsx(e.h2,{children:'What "O(1)" Actually Means'}),`
`,n.jsxs(e.p,{children:["The O(1) lookup guarantee relies on one assumption: ",n.jsx(e.strong,{children:"the hash function distributes keys uniformly."})]}),`
`,n.jsx(e.p,{children:"If all your keys hash to the same slot, lookup degrades to O(n) — you're scanning a linked list at that slot. This isn't a theoretical concern. Hash flooding attacks exploit exactly this: sending keys that all collide to degrade HashMap performance from O(1) to O(n)."}),`
`,n.jsx(e.p,{children:"Python 3.3+ and Java randomize their hash functions per process (PYTHONHASHSEED, String hash randomization). This defeats precomputed attacks but means you can't assume hash values are stable across runs."}),`
`,n.jsx(e.h2,{children:"The Practical Takeaway"}),`
`,n.jsx(e.p,{children:"HashMaps are the right data structure when:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"You need O(1) average-case lookup by key"}),`
`,n.jsx(e.li,{children:"Insertion order doesn't matter (or you're using Python 3.7+/Java's LinkedHashMap)"}),`
`,n.jsx(e.li,{children:"Your keys have good hash function coverage"}),`
`]}),`
`,n.jsx(e.p,{children:"They're the wrong data structure when:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"You need sorted order (use a balanced BST / TreeMap)"}),`
`,n.jsx(e.li,{children:"You need range queries (use a B-Tree index in a database)"}),`
`,n.jsx(e.li,{children:"Memory is extremely constrained (each entry has overhead)"}),`
`]}),`
`,n.jsx(e.p,{children:'Understanding the implementation turns "use a HashMap" from cargo-culting into a deliberate choice.'})]})}function w(t={}){const{wrapper:e}=t.components||{};return e?n.jsx(e,{...t,children:n.jsx(h,{...t})}):h(t)}const T=Object.freeze(Object.defineProperty({__proto__:null,default:w,frontmatter:v},Symbol.toStringTag,{value:"Module"})),k=Object.assign({"/content/journal/b-trees-from-first-principles/index.mdx":x,"/content/journal/designing-better-apis/index.mdx":j,"/content/journal/react-context-hidden-cost/index.mdx":b,"/content/journal/why-hashmaps-feel-magical/index.mdx":T});function r(){return Object.entries(k).map(([t,e])=>{const d=t.split("/")[3],l=t.substring(0,t.lastIndexOf("/")),s={slug:d,...e.frontmatter,Component:e.default};return s.cover&&(s.cover=c(s.cover,l)),s})}function C(){return r().filter(t=>t.status==="published").sort((t,e)=>new Date(e.publishedAt).getTime()-new Date(t.publishedAt).getTime())}function S(t){return r().find(e=>e.slug===t&&e.status==="published")}function P(){return r().find(t=>t.featured&&t.status==="published")}export{C as a,S as b,_ as f,P as g};

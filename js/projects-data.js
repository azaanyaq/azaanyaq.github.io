/* ==========================================================================
   PROJECT DATA - the only file you need to edit to add or change projects.

   Everything on the Projects page (filters, grid, detail view) is rendered
   from the lists below. To add a project, copy one of the objects in
   PROJECTS and edit it. No HTML or CSS changes are needed.

   Thumbnails live in assets/projects/. A 4:3 image (e.g. 1200x900) fits the
   card without cropping.

   ---------------------------------------------------------------------------
   Project fields (only `id` and `title` are required; leave out anything that
   doesn't apply and nothing will render for it):

     id           URL slug, unique. Used for the shareable link /projects/<id>
     title        Project name
     categories   Array of category ids from PROJECT_CATEGORIES (multi-tag OK)
     status       One id from PROJECT_STATUSES: "completed", "updating" or
                  "in-progress". Shown as a badge on the card and in Details
     oneLiner     Short hook shown on the card and under the detail title
     description  Full write-up. Either one string (separate paragraphs with a
                  blank line) or an array of paragraph strings. In the array
                  form, a media object ({ type: "image", src, alt, caption })
                  between two strings shows that image inside the write-up
     techStack    Array of tool / language names (dot colours: TECH_DOMAINS)
     techStackNote
                  Short label next to the "Tech stack" heading,
                  e.g. "Subject to change" for in-progress projects
     thumbnail    Image path relative to the site root, e.g.
                  "assets/projects/my-project.jpg" (or a full https:// URL).
                  If the file is missing, the card shows a plain "No image" box
     thumbnailAlt Alt text for the thumbnail
     links        Object of { type: url }. Built-in labels: code, demo,
                  report, paper, video. Any other key still works and is
                  labelled from its name, or pass { url, label } to set the
                  button text yourself. Empty {} renders no buttons
     note         Short disclaimer shown under the title area in the detail
                  view, e.g. why there's no public code
     media        Array of { type, src, caption?, alt?, title?, poster? }
                  Built-in types: "image", "video", "embed" (iframe: YouTube,
                  Vimeo, interactive demos). Empty [] renders nothing.
                  An "embed" of a page on this site can set autoHeight: true
                  to grow the iframe to fit (the page must post its height)
     year, role, team
                  Shown in the "Details" sidebar
     meta         Extra label -> value pairs for the "Details" sidebar,
                  e.g. { Client: "PwC", Duration: "10 weeks" }

   New field types are added in js/projects.js (see DETAIL_FIELDS,
   LINK_TYPES and MEDIA_RENDERERS near the top of that file).
   ========================================================================== */

/* Categories drive the filter row, in this order. `id` is what projects
   reference in their `categories` array; `label` is what's displayed.
   `color` is used for the category's dots, card stripe and filter underline:
   one of the --cat-* tokens in css/style.css, or any CSS colour ("#E07A7A"). */
const PROJECT_CATEGORIES = [
  { id: "computer-vision", label: "Computer Vision", color: "var(--cat-cv)" },
  { id: "robotics-autonomy", label: "Robotics & Autonomy", color: "var(--cat-robotics)" },
  { id: "ml-software", label: "ML/Software", color: "var(--cat-ml)" },
  { id: "mechanical", label: "Mechanical", color: "var(--cat-mech)" },
];

/* Project statuses. `color` is the badge dot: one of the --status-* tokens
   in css/style.css, or any CSS colour. */
const PROJECT_STATUSES = [
  { id: "completed", label: "Completed", color: "var(--status-completed)" },
  { id: "updating", label: "Updating", color: "var(--status-updating)" },
  { id: "in-progress", label: "In Progress", color: "var(--status-in-progress)" },
];

/* Colours the dot next to each tool in a project's tech stack by mapping the
   tool name (exactly as written in `techStack`) to a category id above.
   Tools not listed here (e.g. Python) get a neutral grey dot. */
const TECH_DOMAINS = {
  // Computer vision
  "OpenCV": "computer-vision",
  "YOLO": "computer-vision",
  "YOLO26": "computer-vision",
  "DeepFace": "computer-vision",
  "MediaPipe": "computer-vision",
  "CNN-based Tracking": "computer-vision",

  // ML / software
  "PyTorch": "ml-software",
  "NumPy": "ml-software",
  "FastAPI": "ml-software",
  "Next.js": "ml-software",
  "TypeScript": "ml-software",
  "PostgreSQL": "ml-software",
  "Azure Blob Storage": "ml-software",
  "Nginx": "ml-software",
  "WebSockets": "ml-software",
  "PyPI Packaging": "ml-software",
  "Matplotlib": "ml-software",
  "Jupyter": "ml-software",

  // Robotics, autonomy & deployment
  "ROS 2": "robotics-autonomy",
  "ROS-style IPC": "robotics-autonomy",
  "NVIDIA Jetson": "robotics-autonomy",
  "Docker Compose": "robotics-autonomy",
  "systemd": "robotics-autonomy",
  "Kalman Filters": "robotics-autonomy",
  "Sensor Fusion": "robotics-autonomy",
  "iOS Sensor Logging": "robotics-autonomy",

  // Mechanical
  "SolidWorks": "mechanical",
  "CNC Machining": "mechanical",
  "GD&T": "mechanical",
  "FMEA": "mechanical",
  "DFM": "mechanical",
  "Psychrometric Analysis": "mechanical",
};

const PROJECTS = [
  {
    id: "imperial-auv",
    title: "Imperial AUV - Autonomous AUV Drones",
    categories: ["robotics-autonomy", "computer-vision"],
    status: "in-progress",
    oneLiner: "Co-founding Imperial's first AUV society and prototyping perception and autonomy for a 5-vehicle underwater mapping swarm.",
    description: [
      `Imperial AUV is Imperial College London's first Autonomous Underwater Vehicle society, which I co-founded and which now has 5+ members. The long-term goal is a swarm of five vehicles that communicate with each other and run synchronised bathymetric surveys to map lakes and rivers.`,
      `The design targets are a 3 m operating depth and 10-20 cm mapping resolution. These are goals for the finished system rather than results yet, and this page will be updated as the prototypes are built and tested.`,
      `I lead perception and autonomy, where I am responsible for the perception algorithms and software implementation; however, I contribute to all aspects of the project's design.`,
      `The project is currently in the prototyping phase: we're procuring all the parts needed and have begun to assemble some of the 3D printed modules.`,
      {
        type: "image",
        src: "assets/projects/imperial-auv-modules.jpg",
        alt: "Two assembled 3D printed hull modules for the AUV on a workbench, with a black ducted thruster fitted in the side of one module",
        caption: "Early assembly of the 3D printed hull modules, with a thruster fitted.",
      },
    ],
    techStack: ["OpenCV", "CNN-based Tracking", "ROS 2"],
    techStackNote: "Subject to change",
    thumbnail: "assets/projects/imperial-auv-thumb.jpg",
    thumbnailAlt: "CAD render of the Imperial AUV: a torpedo-shaped underwater vehicle with a rear thruster, fins and a cutaway hull section",
    links: {},
    media: [],
    role: "Co-founder & Head of Automation",
    team: "5+ members",
  },
  {
    id: "telebot",
    title: "Telebot - Perception & Teleoperation for a Robotic Arm",
    categories: ["computer-vision", "robotics-autonomy"],
    status: "completed",
    oneLiner: "Real-time person-tracking and teleoperation for a 6-DOF robotic arm, deployed on edge hardware.",
    description: `Built at PwC's Frontier Labs, Telebot is an edge-to-cloud robotic arm system. A Jetson-mounted camera runs YOLO object detection at ~15 FPS, feeding a PD-controlled visual servo loop that lets a 6-DOF arm track and follow a person autonomously, with hold-on-fault safety if detection drops out.

The vision and motor-control code run as two isolated Python runtimes communicating over IPC, so a fault in perception can't take down hardware control. The whole stack is deployed via Docker Compose and systemd, with Nginx/TLS handling a live encrypted WebSocket video stream to 10+ concurrent viewers at sub-30ms latency, and live mode-switching between autonomous tracking and manual teleoperation.

The system was paired with Meta Ray-Ban smart glasses for a first-person teleoperation demo, showcased to 1,000+ attendees at a week-long Department of Government Enablement event in Abu Dhabi, and presented directly to visiting government officials.`,
    techStack: ["Python", "PyTorch", "YOLO", "ROS-style IPC", "Docker Compose", "Nginx", "systemd", "NVIDIA Jetson", "WebSockets"],
    thumbnail: "assets/projects/telebot-thumb.jpg",
    thumbnailAlt: "Two robotic arms on a desk beside a control box with a screen and a six-button control keypad, one arm being moved by hand",
    links: {
      // proprietary PwC work - no public code. Leave empty unless you get a demo video/report cleared to share.
    },
    media: [
      // e.g. { type: "video", src: "assets/projects/telebot-demo.mp4", caption: "First-person teleop demo, DGE Abu Dhabi" }
    ],
    year: "2026",
    role: "Mechatronics & CV Intern",
    team: "PwC Frontier Labs",
    note: "All code for this project is under NDA and is not accessible to me.",
  },
  {
    id: "visionhub",
    title: "VisionHub - Multi-Model Computer Vision Platform",
    categories: ["computer-vision", "ml-software"],
    status: "completed",
    oneLiner: "A hub-and-worker CV platform routing live video to isolated facial recognition, detection, and tracking models.",
    description: `VisionHub is a real-time computer vision platform built around a hub-and-worker architecture: a Next.js/FastAPI hub dispatches live video frames to isolated ML workers, each running in its own process with self-registering health checks that distinguish a crashed worker from one that's simply timing out.

I led the facial recognition pipeline using DeepFace - live enrolment with quality gates, 512-dimension ArcFace embeddings matched via cosine similarity, and a verification flow with live emotion/attribute analysis - hitting 90% accuracy across 10+ users. I then extended this into CCTV attendance tracking, with present/absent/indeterminate logging designed specifically to avoid misreading degraded footage as "absent."

Alongside this, the platform runs multi-object detection and tracking with YOLO, including class-aware tracking for people vs. vehicles in traffic monitoring, and a dedicated model for PPE compliance detection with a persisted violation archive backed by PostgreSQL and Azure Blob Storage.`,
    techStack: ["Python", "FastAPI", "Next.js", "TypeScript", "DeepFace", "YOLO26", "MediaPipe", "PostgreSQL", "Azure Blob Storage"],
    thumbnail: "assets/projects/visionhub-thumb.jpg",
    thumbnailAlt: "VisionHub interface: a central camera hub linked to waste classification, traffic detection, safety compliance, creative experience and facial recognition modules",
    links: {
      // proprietary PwC work - no public code
    },
    media: [],
    year: "2026",
    role: "Mechatronics & CV Intern",
    team: "PwC Frontier Labs",
    note: "All code for this project is under NDA and is not accessible to me.",
  },
  {
    id: "stepfusion",
    title: "StepFusion - Pedestrian Dead Reckoning with a Kalman Filter",
    categories: ["ml-software", "robotics-autonomy"],
    status: "completed",
    oneLiner: "GPS-free indoor position tracking from a phone's IMU, fusing gyroscope and magnetometer readings.",
    description: `StepFusion tracks a walked path indoors with no GPS, using only an iPhone's accelerometer, gyroscope, and magnetometer. Footsteps are detected from accelerometer peaks - validated against a manual count at 156 detected vs. 150 actual steps (~4% error) over a 110-second walk.

A Kalman filter fuses gyroscope and magnetometer readings into a corrected heading, with noise parameters estimated directly from the recorded sensor data rather than guessed. The first design actually underperformed plain gyroscope tracking - tracing this to real magnetic interference in the room (an 8% swing in field strength) led to a redesign that corrects heading only at each footstep instead of every sensor reading.

That redesign cut position error by 12.7% on a long walk (3.64m → 3.18m error), though the same fix doesn't help on shorter walks - a limitation the write-up digs into further.`,
    techStack: ["Python", "NumPy", "Kalman Filters", "Sensor Fusion", "iOS Sensor Logging"],
    thumbnail: "assets/projects/stepfusion-thumb.jpg",
    thumbnailAlt: "Plot of a walked indoor loop comparing raw gyroscope-only tracking with the Kalman-fused path",
    links: {
      code: "https://github.com/azaanyaq/step-fusion",
    },
    media: [],
    year: "2026",
    role: "Solo project",
  },
  {
    id: "edunet",
    title: "EduNet - A Neural Network Library Built from Scratch",
    categories: ["ml-software"],
    status: "updating",
    oneLiner: "A NumPy-only neural network library with hand-written backprop, gradient checking, and a live training visualiser.",
    description: [
      `EduNet is a neural network library built entirely from scratch in Python - forward propagation, backpropagation, and gradient descent implemented by hand in NumPy, with no ML framework underneath.

Correctness is verified with gradient checking - comparing analytical gradients against an independent numerical estimate - rather than just trusting a dropping cost curve, with accuracy to 1e-7. The library supports swappable activation and cost functions, and is packaged as a pip-installable Python package on PyPI.

An interactive visualiser lets you watch a network train in real time: decision boundaries forming, gradients flowing through the network diagram, and cost dropping - built as a teaching tool as much as a working library. It's aimed at being updated incrementally with new features over time.`,
      {
        type: "embed",
        src: "demos/edunet/",
        title: "Interactive EduNet visualiser demo",
        autoHeight: true,
        caption: "Interactive demo: a browser port of EduNet's visualiser, using the same preset as demo_vis() (a [2, 5, 5, 1] network, 200 epochs, learning rate 0.6). Pick a dataset, press Play, or click a point to follow it through the network.",
      },
    ],
    techStack: ["Python", "NumPy", "PyPI Packaging"],
    thumbnail: "assets/projects/edunet-thumb.jpg",
    thumbnailAlt: "EduNet's training visualiser showing a small neural network with positive and negative weights in blue and red",
    links: {
      code: "https://github.com/azaanyaq/edunet",
      // TODO: add your PyPI link. Note pypi.org/project/edunet is a different author's package.
      // pypi: { url: "https://pypi.org/project/<your-package-name>/", label: "PyPI" },
    },
    media: [],
    year: "2026",
    role: "Solo project",
  },
  {
    id: "f24-drivetrain",
    title: "F24 Drivetrain - Design & Manufacture of a 3-Stage Gearbox",
    categories: ["mechanical"],
    status: "completed",
    oneLiner: "Led a 5-person team designing and manufacturing a 3-stage drivetrain for Imperial's F24 kit car.",
    description: `As Project Manager for Imperial's F24 kit car drivetrain, I led a 5-member team through a 10-week design-to-manufacture project on a 3-stage (chain-gear-chain) drivetrain, achieving a 9.5:1 gear ratio at 20.1 km/h against a 25 km/h speed constraint, on a £300 budget.

I contributed to the SolidWorks CAD modelling and engineering analysis - shaft torsion calculations, gear bending stress via the Lewis form factor method, and bearing life (L10) calculations - and manufactured the drivetrain in-house through CNC machining, turning, milling, and fabrication, using taper-bushed sprockets and CNC-duplicated shafts to cut manufacturing time.

I authored the majority of the technical report, including a full failure mode and effects analysis (FMEA) that identified chain derailment as the highest-priority failure risk - findings that fed directly back into the final design.`,
    techStack: ["SolidWorks", "CNC Machining", "GD&T", "FMEA", "DFM"],
    thumbnail: "assets/projects/f24-thumb.jpg",
    thumbnailAlt: "The Imperial F24 kit car with its drivetrain housing under a clear cover",
    links: {
      report: "assets/projects/f24-drivetrain-report.pdf",
      poster: { url: "assets/projects/f24-design-poster.pdf", label: "Design Poster" },
    },
    media: [],
    year: "2025",
    role: "Project Manager",
    team: "5 people",
  },
  {
    id: "wave-cloak",
    title: "Wave Cloak - Finite-Difference Simulation of an Invisibility Cloak",
    categories: ["ml-software"],
    status: "completed",
    oneLiner: "A 2D wave simulation that bends waves around a cloaked object, verified with a hand-written Fourier transform.",
    // Paragraphs as an array so a figure can sit between them
    description: [
      `Built for Imperial's ME2 Computing coursework, this project simulates an "invisibility cloak" for waves. A sine-wave source sends an electric field across a 4 m by 1.5 m domain towards a reflecting cylinder, which is wrapped in a ring whose wave speed varies with radius - a simplified cloak based on transformation optics (Pendry et al., 2006) that guides the wave around the object so it rejoins on the other side instead of leaving a shadow.`,
      `The 2D wave equation is solved with an explicit central-difference scheme on a 400 x 150 grid, vectorised with NumPy array slicing rather than loops. The time step is derived from the stability condition and set to 80% of the limit, a special first step handles the at-rest initial condition, and the symmetry about y = 0 is used to simulate only the top half of the domain, halving the computation.`,
      `To check the cloak behaves physically, a sensor directly behind the object records the field over 1,500 time steps, and a hand-written discrete Fourier transform of the settled signal shows a single clear peak at the 4 Hz source frequency - confirming the cloak redirects the wave without changing its frequency.`,
      {
        type: "image",
        src: "assets/projects/wave-cloak-sensor.png",
        alt: "Line plot of wave amplitude at the sensor over 8.5 seconds: flat until about 2.7 s, then small oscillations, then larger steady oscillations from about 5.7 s",
        caption: "Wave amplitude recorded at the sensor behind the cloak (x = 2.5 m, y = 0 m).",
      },
      {
        type: "image",
        src: "assets/projects/wave-cloak-spectrum.png",
        alt: "Frequency spectrum of the sensor signal with one sharp peak at 4 Hz, lined up with a dashed line marking the 4 Hz input driver frequency",
        caption: "Discrete Fourier transform of the sensor signal, peaking at the 4 Hz input frequency.",
      },
      `The write-up also covers the model's limitations, including reflections from the domain edges and a grid too coarse to resolve the slow-wave region next to the object.`,
    ],
    techStack: ["Python", "NumPy", "Matplotlib", "Jupyter", "Finite Differences", "Discrete Fourier Transform"],
    thumbnail: "assets/projects/wave-cloak-thumb.jpg",
    thumbnailAlt: "Simulated electric field with red and blue wavefronts bending around a cloaked circular object, with a sensor point behind it",
    links: {
      code: "https://github.com/azaanyaq/ME2-computing-cswk",
    },
    media: [],
    team: "2 people",
  },
  {
    id: "ac-lab",
    title: "AC Lab - Thermodynamic Analysis of an Air Conditioning Unit",
    categories: ["mechanical"],
    status: "completed",
    oneLiner: "Ran experiments on a lab air conditioning unit, then used psychrometrics and energy balances to test its quoted heat transfer rates.",
    description: [
      `For Imperial's ME2 Thermofluids lab, we tested whether a Hilton A660 air conditioning unit delivers its manufacturer's quoted heat transfer rates across its four stages: boiler, preheater, cooler and reheater.`,
      `We ran the unit ourselves first, recording dry and wet bulb temperatures at each stage, the orifice pressure drop and the condensate collected every 3 minutes. A steam leak from the boiler meant the early readings were discarded, leaving five valid repeats.`,
      `I then used psychrometric analysis, mass conservation and the steady-flow energy equation to calculate each stage's heat transfer rate, propagating uncertainties throughout.`,
      `The preheater and boiler matched the quoted 6 kW to within 1.7% (5.90 ± 0.48 kW), but the reheater came out 82% low (0.18 kW against 1 kW). The report traces this to the boiler leak, environmental drift and single-point temperature measurements in the duct, and suggests how to fix them.`,
    ],
    techStack: ["Psychrometric Analysis"],
    thumbnail: "assets/projects/ac-lab-thumb.jpg", // Figure 1 of the report (P.A. Hilton product photo)
    thumbnailAlt: "The Hilton A660 air conditioning laboratory unit: a ducted air system with fan, control panel and refrigeration components on a wheeled frame",
    links: {
      report: "assets/projects/ac-lab-report.pdf", // report without the cover page (no CID / tutor group)
    },
    media: [],
    year: "2026",
  },
];

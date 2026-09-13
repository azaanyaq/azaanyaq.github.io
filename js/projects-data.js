/* ==========================================================================
   PROJECT DATA — the only file you need to edit to add or change projects.

   Everything on the Projects page (filters, grid, detail view) is rendered
   from the two lists below. To add a project, copy one of the objects in
   PROJECTS and edit it. No HTML or CSS changes are needed.

   All entries below are PLACEHOLDER / EXAMPLE content. Replace them.

   ---------------------------------------------------------------------------
   Project fields (only `id` and `title` are required; leave out anything that
   doesn't apply and nothing will render for it):

     id           URL slug, unique. Used for the shareable link /projects/<id>
     title        Project name
     categories   Array of category ids from PROJECT_CATEGORIES (multi-tag OK)
     oneLiner     Short hook shown on the card and under the detail title
     description  Full write-up. Either one string (separate paragraphs with a
                  blank line) or an array of paragraph strings
     techStack    Array of tool / language names
     thumbnail    Image path relative to the site root, e.g.
                  "assets/projects/my-project.jpg" (or a full https:// URL)
     thumbnailAlt Alt text for the thumbnail
     links        Object of { type: url }. Built-in labels: code, demo,
                  report, paper, video. Any other key still works and is
                  labelled from its name, or pass { url, label } to set the
                  button text yourself
     media        Array of { type, src, caption?, alt?, title?, poster? }
                  Built-in types: "image", "video", "embed" (iframe: YouTube,
                  Vimeo, interactive demos)
     meta         Object of label -> value shown in the sidebar,
                  e.g. { Year: "2025", Role: "Perception lead" }

   New field types are added in js/projects.js (see DETAIL_FIELDS,
   LINK_TYPES and MEDIA_RENDERERS near the top of that file).
   ========================================================================== */

/* Categories drive the filter row, in this order. `id` is what projects
   reference in their `categories` array; `label` is what's displayed. */
const PROJECT_CATEGORIES = [
  { id: "computer-vision", label: "Computer Vision" },
  { id: "robotics", label: "Robotics & Autonomy" },
  { id: "ml-software", label: "ML/Software" },
  { id: "mechanical", label: "Mechanical" },
];

const PROJECTS = [
  /* PLACEHOLDER — multi-tag project, all three link types, mixed media
     including an embedded video */
  {
    id: "stereo-depth-rover",
    title: "Stereo Depth Perception for a Field Rover",
    categories: ["computer-vision", "robotics"],
    oneLiner: "Real-time stereo depth and obstacle mapping on an embedded GPU.",
    description: [
      "PLACEHOLDER write-up. A small outdoor rover needed to navigate uneven terrain without a LiDAR, so the goal was to get a usable obstacle map from a low-cost stereo camera running entirely on-board.",
      "The pipeline rectifies the stereo pair, computes a disparity map with a lightweight learned matcher, and projects valid points into a rolling 2.5D elevation grid that the local planner consumes at 15 Hz. Most of the work went into calibration drift, filtering sky and reflective surfaces, and keeping latency predictable on a Jetson-class board.",
      "In field tests the rover completed a 400 m course with no collisions. The main limitations were low-texture ground and direct sunlight, which the write-up discusses along with ideas for fusing wheel odometry to stabilise the map.",
    ],
    techStack: ["Python", "C++", "ROS 2", "OpenCV", "PyTorch", "TensorRT", "NVIDIA Jetson"],
    thumbnail: "assets/projects/stereo-depth-rover.svg",
    thumbnailAlt: "Placeholder thumbnail for the stereo depth rover project",
    links: {
      code: "https://github.com/your-username/stereo-depth-rover",
      demo: "https://example.com/stereo-depth-rover-demo",
      report: "https://example.com/stereo-depth-rover-report.pdf",
    },
    media: [
      {
        type: "embed",
        src: "https://www.youtube-nocookie.com/embed/VIDEO_ID",
        title: "Rover field test video",
        caption: "Placeholder embed. Swap VIDEO_ID for a real YouTube video ID.",
      },
      {
        type: "image",
        src: "assets/projects/media-placeholder.svg",
        alt: "Placeholder for a disparity map next to the source camera frame",
        caption: "Disparity output alongside the left camera frame (placeholder image).",
      },
    ],
    meta: {
      Year: "2025",
      Role: "Perception lead",
      Team: "4 people",
    },
  },

  /* PLACEHOLDER — multi-tag project with a single link type (code only) */
  {
    id: "surface-defect-detection",
    title: "Surface Defect Detection",
    categories: ["computer-vision", "ml-software"],
    oneLiner: "A small-data defect classifier for machined aluminium parts.",
    description:
      "PLACEHOLDER write-up. Inspection on a production line was manual and inconsistent, and only a few hundred labelled defect images existed.\n\n" +
      "I built a segmentation model on a pretrained backbone with heavy synthetic augmentation, then wrapped it in a small inference service with a review UI so operators could correct predictions and grow the dataset over time.\n\n" +
      "The final model reached high recall on held-out parts while keeping false rejects low enough to be useful on the line.",
    techStack: ["Python", "PyTorch", "Albumentations", "FastAPI", "Docker"],
    thumbnail: "assets/projects/surface-defect-detection.svg",
    thumbnailAlt: "Placeholder thumbnail for the surface defect detection project",
    links: {
      code: "https://github.com/your-username/surface-defect-detection",
    },
    meta: {
      Year: "2024",
    },
  },

  /* PLACEHOLDER — mechanical + robotics, no links at all, image-only media */
  {
    id: "quadruped-leg-module",
    title: "Quadruped Leg Module",
    categories: ["mechanical", "robotics"],
    oneLiner: "A backdrivable, 3-DoF leg designed around a single actuator type.",
    description: [
      "PLACEHOLDER write-up. This was a design study for a modular leg that could be reused across a small quadruped platform, keeping part count and unique components low.",
      "The leg uses a belt-driven knee to keep mass close to the hip, and a cycloidal reducer that stays backdrivable for compliant contact. I iterated through three printed prototypes before machining the final load-bearing parts.",
    ],
    techStack: ["SolidWorks", "FEA", "Fusion 360", "3D printing", "CNC machining"],
    thumbnail: "assets/projects/quadruped-leg-module.svg",
    thumbnailAlt: "Placeholder thumbnail for the quadruped leg module project",
    media: [
      {
        type: "image",
        src: "assets/projects/media-placeholder.svg",
        alt: "Placeholder for an exploded CAD view of the leg assembly",
        caption: "Exploded view of the leg assembly (placeholder image).",
      },
    ],
    meta: {
      Year: "2023",
      Role: "Mechanical design",
    },
  },

  /* PLACEHOLDER — single category, shows a non-default link type ("paper") */
  {
    id: "visual-slam-benchmark",
    title: "Visual SLAM Benchmark Suite",
    categories: ["robotics"],
    oneLiner: "Reproducible comparisons of open-source visual SLAM systems.",
    description:
      "PLACEHOLDER write-up. Comparing SLAM systems is hard because every paper uses different datasets, settings and metrics.\n\n" +
      "This suite runs several open-source systems in containers against the same sequences, then reports trajectory error, drift and runtime in one consistent format.",
    techStack: ["C++", "Python", "ROS 2", "Docker", "evo"],
    thumbnail: "assets/projects/visual-slam-benchmark.svg",
    thumbnailAlt: "Placeholder thumbnail for the visual SLAM benchmark project",
    links: {
      code: "https://github.com/your-username/visual-slam-benchmark",
      paper: "https://example.com/visual-slam-benchmark-paper.pdf",
    },
  },

  /* PLACEHOLDER — minimal project: mostly-empty fields, one link type
     (report). Shows that missing fields simply don't render. */
  {
    id: "compliant-gripper",
    title: "Compliant Gripper",
    categories: ["mechanical"],
    oneLiner: "A single-piece flexure gripper for handling delicate produce.",
    description:
      "PLACEHOLDER write-up. A monolithic flexure gripper printed in TPU, tuned so that grip force stays within a safe range across a variety of object sizes.",
    thumbnail: "assets/projects/compliant-gripper.svg",
    thumbnailAlt: "Placeholder thumbnail for the compliant gripper project",
    links: {
      report: "https://example.com/compliant-gripper-report.pdf",
    },
  },
];

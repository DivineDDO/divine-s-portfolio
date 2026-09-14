// Just data, no logic. Keeping it separate from page.js means adding or editing
// a project is just editing this list, no need to touch any JSX.

// Feeds the CAD Skills grid in page.js — each entry becomes one card.
// id needs to be unique since it's how the page knows which project's popup to open,
// thumbnail is the image path under /public, and description shows under the enlarged image.
export const blenderProjects = [
  {
    id: 1,
    title: "Skatepark",
    description: "A skatepark I designed and modelled in Blender — focused on realistic ramps, transitions, and concrete textures inspired by urban plazas.",
    thumbnail: "/images/blender/skatepark.png",
  },
  {
    id: 2,
    title: "Illumination",
    description: "Blender scenes exploring lighting techniques, including global illumination, reflections, and shadows to create a realistic and atmospheric environment.",
    thumbnail: "/images/blender/illumination.png",
  },
  {
    id: 3,
    title: "BMO Model",
    description: "A detailed Blender model of BMO from Adventure Time, emphasizing form, material detail, and stylized lighting.",
    thumbnail: "/images/blender/BMO.png",
  },
  {
    id: 4,
    title: "UV Mapping Exercise",
    description: "Practice exercise for UV mapping techniques in Blender.",
    thumbnail: "/images/blender/uv-mapping.png",
  }
];

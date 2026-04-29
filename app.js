// ========== SUPABASE ==========
const SUPABASE_URL = "https://yubbtxpvqdoyvdoadxjx.supabase.co";
const SUPABASE_ANON_KEY = 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YmJ0eHB2cWRveXZkb2FkeGp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMzE0NDcsImV4cCI6MjA4NzcwNzQ0N30.nwkHXuqSMl0gLyBIf1lp95mpYLXkSsBvpilnAYhxchg";

if (!window.supabase) {
  alert("Supabase library not loaded. Ensure supabase-js v2 CDN is included before app.js.");
  throw new Error("supabase-js not loaded");
}

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function registerPush() {
  try {

    if (!("Notification" in window)) return;

    const permission = await Notification.requestPermission();

    if (permission !== "granted") return;

    const firebase = await import(
      "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"
    );

    const messagingLib = await import(
      "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js"
    );

    const app = firebase.initializeApp({
      apiKey: "AIzaSyAVEEyXIgAgseGFEPt4i6nezAS_6TXXuKs",
      authDomain: "imsapp-619b6.firebaseapp.com",
      projectId: "imsapp-619b6",
      storageBucket: "imsapp-619b6.firebasestorage.app",
      messagingSenderId: "547704030976",
      appId: "1:547704030976:web:d5c5ad3545b213fd77d5e5",
      measurementId: "G-JZ1HQX5NET"
    });

    const messaging = messagingLib.getMessaging(app);

    // Only unregister the Firebase SW if already registered; leave the app SW intact
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const reg of registrations) {
      if (reg.active?.scriptURL.includes("firebase-messaging-sw.js")) {
        await reg.unregister();
      }
    }

    const registration = await navigator.serviceWorker.register("./firebase-messaging-sw.js");

    const token = await messagingLib.getToken(messaging, {
      vapidKey: "BGX4KzASHBw1ISMkLUhUEx6KXEtFMpFmWfa4KZFkFXZvvZPy_SHCAVF18W-WB1N0CK-9YPDU29HR9bqAzYjoG3Y",
      serviceWorkerRegistration: registration,
    });

    if (!token) return;

    await db.from("push_tokens").upsert(
      { email: currentUser, token: token },
      { onConflict: "email" }
    );

    console.log("Push registered:", token);
    

  } catch (err) {
    console.error("Push registration failed:", err);
    
  }
}

// ========== CONFIG ==========
const PASSWORDS = { admin: "admin2025", instructor: "instructor2025" };

const AIRTABLE_INVITE_URL =
  "https://airtable.com/appH63nLT8wsF37OE/shrlW2aVa9EJzqQET";

// ========== PARTS ==========
const CATEGORIES = [
  {
    name: "Electronics",
    icon: "⚡",
    parts: [
      { id: "large_hub", name: "Large Hub", expected: 1, image: "Parts_Images/largehub.png" },
      { id: "hub_battery", name: "Hub Battery", expected: 1, image: "Parts_Images/Hubbattery.png" },
      { id: "medium_motor", name: "Medium Motor", expected: 2, image: "Parts_Images/mediummotor.webp" },
      { id: "large_motor", name: "Large Motor", expected: 1, image: "Parts_Images/largemotor.webp" },
      { id: "color_sensor", name: "Color Sensor", expected: 1, image: "Parts_Images/cs.webp" },
      { id: "distance_sensor", name: "Distance Sensor", expected: 1, image: "Parts_Images/distancesensor.webp" },
      { id: "force_sensor", name: "Force Sensor", expected: 1, image: "Parts_Images/forcesensor.webp" },
      { id: "micro_usb", name: "USB Cable", expected: 1, image: "Parts_Images/usbcable.webp" },
    ],
  },
  {
    name: "Beams",
    icon: "🔧",
    parts: [
      { id: "beam_3m", name: "Beam 3M", expected: 6, image: "Parts_Images/Beam3M.png" },
      { id: "beam_5m", name: "Beam 5M", expected: 4, image: "Parts_Images/Beam5M.png" },
      { id: "beam_7m", name: "Beam 7M", expected: 6, image: "Parts_Images/Beam7M.png" },
      { id: "beam_9m", name: "Beam 9M", expected: 4, image: "Parts_Images/Beam9M.png" },
      { id: "beam_11m", name: "Beam 11M", expected: 4, image: "Parts_Images/Beam11M.png" },
      { id: "beam_13m", name: "Beam 13M", expected: 4, image: "Parts_Images/Beam13M.png" },
      { id: "beam_15m", name: "Beam 15M", expected: 6, image: "Parts_Images/Beam15M.png" },
    ],
  },
  {
    name: "Frames",
    icon: "⬜",
    parts: [
      { id: "frame_5x7", name: "Frame 5×7", expected: 2, image: "Parts_Images/Frame5x7.png" },
      { id: "frame_7x11", name: "Frame 7×11", expected: 2, image: "Parts_Images/Frame7x11.png" },
      { id: "frame_11x15", name: "Frame 11×15", expected: 1, image: "Parts_Images/Frame11x15.png" },
    ],
  },
  {
    name: "Connectors",
    icon: "🔩",
    parts: [
      { id: "peg_black", name: "Black Pegs", expected: 72, image: "Parts_Images/BlackPegs.png" },
      { id: "peg_blue", name: "Blue Pegs", expected: 20, image: "Parts_Images/BluePegs.png" },
      { id: "bush", name: "Bush", expected: 10, image: "Parts_Images/Bush.png"  },
    ],
  },
  {
    name: "Wheels & Gears",
    icon: "⚙️",
    parts: [
      { id: "wheel_56", name: "Wheel Ø56", expected: 4, image: "Parts_Images/Wheel056.png" },
      { id: "gear_12", name: "Gear Z12", expected: 2, image: "Parts_Images/Gearz12.png" },
      { id: "gear_20", name: "Gear Z20", expected: 2, image: "Parts_Images/Gearz20.png" },
      { id: "gear_36", name: "Gear Z36", expected: 2, image: "Parts_Images/Gearz36.png" },
    ],
  },
  {
    name: "Miscellaneous",
    icon: "📦",
    parts: [
      { id: "minifig_kate", name: "Kate Minifigure", expected: 1, image: "Parts_Images/Kate.png" },
      { id: "minifig_kyle", name: "Kyle Minifigure", expected: 1, image: "Parts_Images/Kyle.png" },
      { id: "storage_box", name: "Storage Box", expected: 1, image: "Parts_Images/StorageBox.png" },
      { id: "sorting_trays", name: "Sorting Trays", expected: 2, image: "Parts_Images/Tray.png" },
    ],
  },
];
const PARTS = CATEGORIES.flatMap((c) => c.parts);

const BIO_CATEGORIES = [
  {
    name: "Craft Supplies",
    icon: "🎨",
    parts: [
      { id: "flower_foam", name: "Flower Foam", expected: 1,image: "Bio_Images/Flower Foam.png"},
      { id: "fabric_quarters", name: "Fabric Quarters", expected: 1, image: "Bio_Images/Fabric Quaters.png" },
      { id: "toothpicks", name: "Toothpicks", expected: 1, image: "Bio_Images/Toothpicks.png" },
      { id: "hot_glue_refills", name: "Hot Glue Refills", expected: 1, image: "Bio_Images/Hot glue refills.png" },
      { id: "craft_sticks", name: "Craft Sticks", expected: 1, image: "Bio_Images/Craft Sticks.png" },
      { id: "masking_tape", name: "Masking Tape", expected: 1, image: "Bio_Images/Masking Tape.png" },
      { id: "modeling_clay", name: "Modeling Clay", expected: 1, image: "Bio_Images/Modeling Clay.png" },
      { id: "transparent_tape", name: "Transparent Tape", expected: 1, image: "Bio_Images/Transparent tape.png" },
      { id: "glue_dots", name: "Glue Dots", expected: 1, image: "Bio_Images/Glue Dots.png" },
      { id: "colored_construction_paper", name: "Colored Construction Paper", expected: 1, image: "Bio_Images/Colored Construction Paper.png" },
      { id: "pipe_cleaners", name: "Pipe Cleaners", expected: 1, image: "Bio_Images/Pipe Cleaners.png" },
      { id: "craft_assortment", name: "Craft Assortment", expected: 1, image: null },
      { id: "glue_sticks", name: "Glue Sticks", expected: 1, image: "Bio_Images/Glue Sticks.png" },
      { id: "white_glue", name: "White Glue", expected: 1, image: "Bio_Images/White Glue.png" },
      { id: "sticky_tack", name: "Sticky Tack", expected: 1, image: "Bio_Images/Sticky tack.png" },
      { id: "yarn", name: "Yarn", expected: 1, image: null },
      { id: "pom_poms", name: "Pom Poms", expected: 1, image: "Bio_Images/Pom poms.png" },
    ],
  },
  {
    name: "Tools",
    icon: "🛠️",
    parts: [
      { id: "hot_glue_guns", name: "Hot Glue Guns", expected: 1, image: "Bio_Images/Hot glue gun.png" },
      { id: "scissors", name: "Scissors", expected: 1, image: "Bio_Images/Scissors.png" },
      { id: "sieves", name: "Sieves", expected: 1, image: "Bio_Images/Sieves.png" },
      { id: "dowel_rod", name: "Dowel Rod", expected: 1, image: "Bio_Images/Dowel Rod.png" },
      { id: "spoons", name: "Spoons", expected: 1, image: "Bio_Images/Spoons.png" },
      { id: "straw_launcher", name: "Straw Launcher", expected: 1, image: "Bio_Images/Straw Lancher.png" },
      { id: "balances", name: "Balances", expected: 1, image: "Bio_Images/Balances.png" },
      { id: "calculators", name: "Calculators", expected: 1, image: "Bio_Images/Calculators.png" },
      { id: "stopwatch", name: "Stopwatch", expected: 1, image: "Bio_Images/Stopwatch.png" },
      { id: "tape_measure", name: "Tape Measure", expected: 1, image: "Bio_Images/Tape Measure.png" },
      { id: "hole_punch", name: "Hole Punch", expected: 1, image: "Bio_Images/Hole punch.png" },
    ],
  },
  {
    name: "Stationery",
    icon: "✏️",
    parts: [
      { id: "index_cards", name: "Index Cards", expected: 1, image: "Bio_Images/Index Cards.png" },
      { id: "stem_journals", name: "STEM Journals", expected: 1, image: "Bio_Images/STEM Journals.png" },
      { id: "markers", name: "Markers", expected: 1, image: "Bio_Images/Markers.png" },
      { id: "pencils", name: "Pencils", expected: 1, image: "Bio_Images/Pencils.png" },
      { id: "rulers", name: "Rulers", expected: 1, image: "Bio_Images/Rulers.png" },
      { id: "colored_pencils", name: "Colored Pencils", expected: 1, image: "Bio_Images/Colored Pencils.png" },
      { id: "white_paper", name: "White Paper", expected: 1, image: "Bio_Images/White Paper.png" },
      { id: "graph_paper", name: "Graph Paper", expected: 1, image: "Bio_Images/Graph Paper.png" },
      { id: "white_butcher_paper", name: "White Butcher Paper", expected: 1, image: "Bio_Images/White Butcher Paper.png" },
      { id: "sharpie_pens", name: "Sharpie Pens", expected: 1, image: "Bio_Images/Sharpie pens.png" },
      { id: "cardstock", name: "Cardstock", expected: 1, image: "Bio_Images/Cardstock.png" },
      { id: "gorongosa_printed_cards", name: "Gorongosa Printed Cards", expected: 1, image: null },
      { id: "erasable_markers", name: "Erasable Markers", expected: 1, image: "Bio_Images/Erasable markers.png" },
    ],
  },
  {
    name: "Lab Equipment",
    icon: "🧪",
    parts: [
      { id: "separatory_funnel", name: "Separatory Funnel", expected: 1, image: "Bio_Images/Separatory funnel.png" },
      { id: "ph_paper", name: "pH Paper", expected: 1, image: "Bio_Images/pH Paper.png" },
      { id: "gallon_jug", name: "Gallon Jug", expected: 1, image: "Bio_Images/gallon jug.png" },
      { id: "graduated_cylinder", name: "Graduated Cylinder", expected: 1, image: "Bio_Images/Graduated cylinder.png" },
      { id: "bucket", name: "Bucket", expected: 1, image: "Bio_Images/Bucket.png" },
      { id: "clear_cups", name: "Clear Cups", expected: 1, image: "Bio_Images/ClearCups.png" },
      { id: "syringe", name: "Syringe", expected: 1, image: "Bio_Images/Syringe.png" },
      { id: "lamps", name: "Lamps", expected: 1, image: "Bio_Images/Lamps.png" },
      { id: "lamp_bulbs", name: "Lamp Bulbs", expected: 1, image: "Bio_Images/LampBulbs.png" },
      { id: "reusable_sandwich_bags", name: "Reusable Sandwich Bags", expected: 1, image: "Bio_Images/Reuseable sandwich bags.png" },
      { id: "beakers_200ml", name: "200 mL Beakers", expected: 1, image: "Bio_Images/200ml Beakers.png" },
      { id: "glass_stirring_rods", name: "Glass Stirring Rods", expected: 1, image: "Bio_Images/Glass stirring rods.png" },
      { id: "test_tubes", name: "Test Tubes", expected: 1, image: "Bio_Images/Test Tubes.png" },
      { id: "test_tube_rack", name: "Test Tube Rack", expected: 1, image: "Bio_Images/TestTube Rack.png" },
      { id: "hot_plate", name: "Hot Plate", expected: 1, image: "Bio_Images/HotPlate.png" },
      { id: "large_beaker", name: "Large Beaker", expected: 1, image: "Bio_Images/Large beaker.png" },
      { id: "test_tube_clamps", name: "Test Tube Clamps", expected: 1, image: "Bio_Images/TestTubeClamps.png" },
      { id: "hot_mitt", name: "Hot Mitt", expected: 1, image: "Bio_Images/Hot Mitt.png" },
      { id: "eye_droppers", name: "Eye Droppers", expected: 1, image: "Bio_Images/EyeDroppers.png" },
    ],
  },
  {
    name: "Lab Materials",
    icon: "🧫",
    parts: [
      { id: "bottles_1_liter", name: "1 Liter Bottles", expected: 2, image: "Bio_Images/1 Liter Bottle x 2 per team.png" },
      { id: "gravel", name: "Gravel", expected: 1, image: "Bio_Images/Gravel.png" },
      { id: "sand", name: "Sand", expected: 1, image: "Bio_Images/Sand.png" },
      { id: "pepper", name: "Pepper", expected: 1, image: "Bio_Images/Pepper.png" },
      { id: "pasta_dry_macaroni", name: "Pasta", expected: 1, image: "Bio_Images/Pasta.png" },
      { id: "food_coloring", name: "Food Coloring", expected: 1, image: "Bio_Images/FoodColoring.png" },
      { id: "pantyhose", name: "Pantyhose", expected: 1, image: "Bio_Images/Pantyhose.png" },
      { id: "sponges", name: "Sponges", expected: 1, image: "Bio_Images/Sponges.png" },
      { id: "cotton", name: "Cotton", expected: 1, image: "Bio_Images/Cotton.png" },
      { id: "cheesecloth", name: "Cheesecloth", expected: 1, image: "Bio_Images/Cheesecloth.png" },
      { id: "rubberbands", name: "Rubberbands", expected: 1, image: "Bio_Images/Rubberbands.png" },
      { id: "activated_charcoal", name: "Activated Charcoal", expected: 1, image: "Bio_Images/Activated Charcoal (rinsed).png" },
      { id: "tub_to_catch_water", name: "Tub to Catch Water", expected: 1, image: "Bio_Images/Tub to catch water.png" },
      { id: "dry_yeast", name: "Dry Yeast", expected: 1, image: null },
      { id: "antacid", name: "Antacid", expected: 1, image: "Bio_Images/Antacid.png" },
      { id: "sugar", name: "Sugar", expected: 1, image: "Bio_Images/Sugar.png" },
      { id: "eraser_tips", name: "Eraser Tips", expected: 1, image: "Bio_Images/Eraser Tips.png" },
      { id: "fresh_spinach_leaves", name: "Fresh Spinach Leaves", expected: 1, image: null },
      { id: "dawn_dish_soap", name: "Dawn Dish Soap", expected: 1, image: "Bio_Images/Dawn Dish Soap.png" },
      { id: "fresh_strawberries", name: "Fresh Strawberries", expected: 1, image: null },
      { id: "liquid_egg_whites", name: "Liquid Egg Whites", expected: 1, image: null },
      { id: "cooking_oil", name: "Cooking Oil", expected: 1, image: "Bio_Images/CookingOil.png" },
      { id: "paper_towels", name: "Paper Towels", expected: 1, image: "Bio_Images/PaperTowels.png" },
      { id: "coffee_filters", name: "Coffee Filters", expected: 1, image: "Bio_Images/CoffeeFilters.png" },
      { id: "popcorn", name: "Popcorn", expected: 1, image: "Bio_Images/Popcorn.png" },
    ],
  },
  {
    name: "Lab Chemicals",
    icon: "⚗️",
    parts: [
      { id: "corn_syrup", name: "Corn Syrup", expected: 1, image: "Bio_Images/CornSyrup.png" },
      { id: "vinegar", name: "Vinegar", expected: 1, image: "Bio_Images/Vinegar.png" },
      { id: "baking_soda", name: "Baking Soda", expected: 1, image: "Bio_Images/Baking Soda.png" },
      { id: "non_iodized_salt", name: "Non-Iodized Salt", expected: 1, image: "Bio_Images/Non-iodized salt.png" },
      { id: "isopropyl_alcohol_99", name: "99% Isopropyl Alcohol", expected: 1, image: "Bio_Images/Isopropyl alcohol.png" },
      { id: "biuret_reagent", name: "Biuret Reagent", expected: 1, image: "Bio_Images/BiuretReagent.png" },
      { id: "benedicts_solution", name: "Benedicts Solution", expected: 1, image: "Bio_Images/BenedictsSolution.png" },
      { id: "iodine_solution", name: "Iodine Solution", expected: 1, image: "Bio_Images/IodineSolution.png" },
      { id: "glucose_solution", name: "Glucose Solution", expected: 1, image: "Bio_Images/GlucoseSolution.png" },
      { id: "starch_solution", name: "Starch Solution", expected: 1, image: "Bio_Images/StarchSolution.png" },
    ],
  },
  {
    name: "Activity Props",
    icon: "🎭",
    parts: [
      { id: "beach_ball", name: "Beach Ball", expected: 1, image: "Bio_Images/BeachBall.png" },
      { id: "trifold_board", name: "Trifold Board", expected: 1, image: "Bio_Images/Trifold board.png" },
      { id: "mini_resin_animals", name: "Mini Resin Animals", expected: 1, image: "Bio_Images/Mini Resin Animals Miniature.png" },
      { id: "glogerm_handwashing_kit", name: "GloGerm Handwashing Kit", expected: 1, image: "Bio_Images/711izcc5ZGL._SL1500_.png" },
      { id: "brown_paper_bags", name: "Brown Paper Bags", expected: 1, image: "Bio_Images/BrownPaperBags.png" },
    ],
  },
  {
    name: "Safety",
    icon: "🥽",
    parts: [
      { id: "safety_goggles", name: "Safety Goggles", expected: 1, image: "Bio_Images/Saftey Goggles.png" },
      { id: "lab_coat", name: "Lab Coat", expected: 1, image: "Bio_Images/Lab coat.png" },
      { id: "gloves", name: "Gloves", expected: 1, image: "Bio_Images/Gloves.png" },
      { id: "hair_ties", name: "Hair Ties", expected: 1, image: "Bio_Images/HairTies.png" },
      { id: "hair_net", name: "Hair Net", expected: 1, image: "Bio_Images/HairNet.png" },
    ],
  },
];
const BIO_PARTS = BIO_CATEGORIES.flatMap((c) => c.parts);

function getPartsForSchool(school) {
  return school?.courseType === "bio" ? BIO_PARTS : PARTS;
}

function getCategoriesForSchool(school) {
  return school?.courseType === "bio" ? BIO_CATEGORIES : CATEGORIES;
}

// ========== STATE ==========
let currentUser = null, // FULL EMAIL
  userRole = null,
  schools = [],
  currentSchool = null,
  currentKit = null;

let currentUserId = null;
let currentUserActive = true;

// key: `${kitId}|${partId}` -> { start, end }
let inventoryData = {},
  pendingChanges = {},
  hasUnsavedChanges = false;

let currentFilter = "all",
  currentSemester = "start",
  currentCourseFilter = "",
  editingSchoolId = null,
  editingKitId = null;

// ========== HELPERS ==========
const formatDate = (d) =>
  d
    ? new Date(d + "T00:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Not set";

const isDeadlinePassed = (d) => (d ? new Date() > new Date(d + "T23:59:59") : false);

const daysUntil = (d) =>
  d ? Math.ceil((new Date(d + "T23:59:59") - new Date()) / 86400000) : null;

const isAdmin = () => userRole === "admin";

const canEditSemester = (sem) =>
  isAdmin() || !isDeadlinePassed(currentSchool?.[sem === "start" ? "startDeadline" : "endDeadline"]);

function invKey(kitId, partId) {
  return `${kitId}|${partId}`;
}

function parseInvKey(key) {
  const [kit_id, part_id] = key.split("|");
  if (!kit_id || !part_id) return null;
  return { kit_id, part_id };
}

function restoreSelection(prevSchoolId, prevKitId) {
  if (prevSchoolId) currentSchool = schools.find((s) => s.id === prevSchoolId) || null;
  if (currentSchool && prevKitId) currentKit = currentSchool.kits.find((k) => k.id === prevKitId) || null;
}

// ========== USERS (ensure row exists, read active) ==========
async function ensureCurrentUserId() {
  currentUserId = null;
  currentUserActive = true;

  if (!currentUser) return null;

  // 1) try select
  {
    const { data, error } = await db
      .from("users")
      .select("user_id,is_active,role")
      .eq("email", currentUser)
      .limit(1);

    if (!error) {
      const row = data?.[0];
      if (row?.user_id) {
        currentUserId = row.user_id;
        currentUserActive = row.is_active ?? true;
        return currentUserId;
      }
    } else {
      console.warn("users select blocked:", error.message);
    }
  }

  // 2) create/upsert if not found
  {
    const { data, error } = await db
      .from("users")
      .upsert({ email: currentUser, role: userRole || "instructor", is_active: true }, { onConflict: "email" })
      .select("user_id,is_active")
      .limit(1);

    if (error) {
      console.warn("users upsert blocked:", error.message);
      return null;
    }

    const row = data?.[0];
    currentUserId = row?.user_id || null;
    currentUserActive = row?.is_active ?? true;
    return currentUserId;
  }
}

// ========== STORAGE (Supabase) ==========
const loadData = async () => {
  // Schools
  let { data: schoolRows, error: sErr } = await db
    .from("schools")
    .select("school_id,user_id,name,start_deadline,end_deadline,created_at,course_type")
    .order("created_at", { ascending: true });

  if (sErr) {
    console.error(sErr);
    alert("Load schools failed: " + sErr.message);
    schools = [];
    inventoryData = {};
    return;
  }

 if (userRole === "instructor") {
    const myId = currentUserId;
    schoolRows = myId ? (schoolRows || []).filter((s) => s.user_id === myId) : [];
  }

  if (isAdmin() && currentCourseFilter) {
    schoolRows = (schoolRows || []).filter((s) => s.course_type === currentCourseFilter);
  }

  // Kits
  const { data: kitRows, error: kErr } = await db
    .from("kits")
    .select("kit_id,school_id,name,created_at")
    .order("created_at", { ascending: true });

  if (kErr) {
    console.error(kErr);
    alert("Load kits failed: " + kErr.message);
    schools = [];
    inventoryData = {};
    return;
  }

  // Part counts
  const { data: partCountRows, error: pcErr } = await db
    .from("part_counts")
    .select("kit_id,part_id,start_actual,end_actual,last_updated_by,last_updated_at");

  if (pcErr) {
    console.error(pcErr);
    alert("Load part counts failed: " + pcErr.message);
    schools = [];
    inventoryData = {};
    return;
  }

  const { data: bioPartCountRows, error: bioPcErr } = await db
    .from("bio_part_counts")
    .select("kit_id,part_id,start_actual,end_actual,last_updated_by,last_updated_at");

  if (bioPcErr) {
    console.error(bioPcErr);
    alert("Load bio part counts failed: " + bioPcErr.message);
    schools = [];
    inventoryData = {};
    return;
  }

  // Build school → kits
  const kitsBySchool = {};
  (kitRows || []).forEach((k) => {
    (kitsBySchool[k.school_id] ||= []).push({
      id: k.kit_id,
      name: k.name || "",
    });
  });

  schools = (schoolRows || []).map((s) => ({
    id: s.school_id,
    userId: s.user_id,
    name: s.name,
    courseType: s.course_type || "robotics",
    startDeadline: s.start_deadline,
    endDeadline: s.end_deadline,
    kits: kitsBySchool[s.school_id] || [],
  }));

  // Flatten counts
  inventoryData = {};
  (partCountRows || []).forEach((pc) => {
    inventoryData[invKey(pc.kit_id, pc.part_id)] = {
      start: pc.start_actual ?? "",
      end: pc.end_actual ?? "",
    };
  });

  (bioPartCountRows || []).forEach((pc) => {
    inventoryData[invKey(pc.kit_id, pc.part_id)] = {
      start: pc.start_actual ?? "",
      end: pc.end_actual ?? "",
    };
  });

  if (currentSchool && !schools.some((s) => s.id === currentSchool.id)) {
    currentSchool = null;
    currentKit = null;
  }
};

// ========== AUTH (PASSWORD-ONLY UI) ==========
function logout() {
  if (hasUnsavedChanges && !confirm("Unsaved changes will be lost. Continue?")) return;

  currentUser = userRole = null;
  currentUserId = null;
  currentUserActive = true;

  currentSchool = null;
  currentKit = null;

  localStorage.removeItem("js_user");

  document.getElementById("email-input").value = "";
  document.getElementById("password-input").value = "";

  showScreen("login-screen");
}

// ========== NAVIGATION ==========
function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  if (id === "menu-screen") {
    const el = document.getElementById("menu-user-display");
    if (el) el.textContent = (currentUser || "").split("@")[0];
    const dashBtn = document.getElementById("dashboard-menu-btn");
    if (dashBtn) dashBtn.style.display = isAdmin() ? "block" : "none";
  } else if (id === "school-screen") {
    updateRoleBadge();
    updateCourseFilterUI();
    renderSchools();
  } else if (id === "kit-screen") {
    currentFilter = "all";
    renderKits();
    updateKitUI();
  } else if (id === "inventory-screen") {
    renderInventory();
    updateInventoryUI();
  } else if (id === "dashboard-screen") {
    updateCourseFilterUI();
    renderDashboard();
  }
}

// Optional helper if you want to call it explicitly
function goToMenu() {
  showScreen("menu-screen");
}

// Button 2 action
function openAirtable() {
  // New tab:
  window.open(AIRTABLE_INVITE_URL, "_blank", "noopener,noreferrer");
  // Same tab (if preferred):
  // window.location.href = AIRTABLE_INVITE_URL;
}

function goBack() {
  if (hasUnsavedChanges && !confirm("Unsaved changes will be lost?")) return;
  hasUnsavedChanges = false;
  pendingChanges = {};
  showScreen("kit-screen");
}

function updateRoleBadge() {
  const b = document.getElementById("role-badge-schools");
  b.textContent = isAdmin() ? "Admin" : "Instructor";
  b.className = "role-badge " + userRole;

  document.getElementById("user-display").textContent = (currentUser || "").split("@")[0];

  const schoolFilters = document.getElementById("school-course-filters");
  const dashboardFilters = document.getElementById("dashboard-course-filters");
  if (schoolFilters) schoolFilters.style.display = isAdmin() ? "flex" : "none";
  if (dashboardFilters) dashboardFilters.style.display = isAdmin() ? "flex" : "none";

  // ✅ remove/hide Add School button for instructors (and kill click)
  const addBtn = document.getElementById("add-school-btn");
  if (addBtn) {
    if (isAdmin()) {
      addBtn.style.display = "block";
      addBtn.disabled = false;
      addBtn.style.pointerEvents = "auto";
      addBtn.onclick = addBtn.onclick || null;
    } else {
      addBtn.style.display = "none";
      addBtn.disabled = true;
      addBtn.style.pointerEvents = "none";
      addBtn.onclick = (e) => {
        if (e) e.preventDefault();
        return false;
      };
    }
  }

  const addEmptyBtn = document.getElementById("add-school-empty-btn");
  if (addEmptyBtn) addEmptyBtn.style.display = isAdmin() ? "block" : "none";

  // Admin-only Manage Instructors button (created once)
  if (isAdmin()) {
    let btn = document.getElementById("manage-instructors-btn");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "manage-instructors-btn";
      btn.className = "btn secondary";
      btn.textContent = "Manage Instructors";
      btn.onclick = manageInstructorsPrompt;

      if (addBtn && addBtn.parentElement) addBtn.parentElement.appendChild(btn);
      else document.body.appendChild(btn);
    }
    btn.style.display = "inline-block";
  } else {
    const btn = document.getElementById("manage-instructors-btn");
    if (btn) btn.style.display = "none";
  }
}

function updateCourseFilterUI() {
  document.querySelectorAll("[data-course-filter]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.courseFilter === currentCourseFilter);
  });
}

async function setCourseFilter(courseType) {
  currentCourseFilter = courseType || "";
  updateCourseFilterUI();

  const prevSchoolId = currentSchool?.id || null;
  const prevKitId = currentKit?.id || null;

  await loadData();
  restoreSelection(prevSchoolId, prevKitId);

  const activeScreen = document.querySelector(".screen.active")?.id;
  if (activeScreen === "dashboard-screen") {
    renderDashboard();
  } else {
    renderSchools();
    filterSchools();
  }
}

// ========== ADMIN: ACTIVE/INACTIVE ==========
async function setInstructorActiveByEmail(email, isActive) {
  if (!isAdmin()) return;

  email = (email || "").trim().toLowerCase();
  if (!email) return alert("Enter an email");

  const { error } = await db
    .from("users")
    .upsert({ email, role: "instructor", is_active: !!isActive }, { onConflict: "email" });

  if (error) {
    console.error(error);
    alert("Failed to update instructor status: " + error.message);
    return;
  }

  alert(`Instructor ${email} set to ${isActive ? "ACTIVE" : "INACTIVE"}.`);
}

async function manageInstructorsPrompt() {
  if (!isAdmin()) return;

  const email = prompt("Instructor email to update (e.g. name@mystemclub.org):");
  if (!email) return;

  const status = (prompt("Type: active OR inactive") || "").trim().toLowerCase();
  if (status !== "active" && status !== "inactive") {
    alert("Invalid status. Type exactly: active OR inactive");
    return;
  }

  await setInstructorActiveByEmail(email, status === "active");
}

// ========== SCHOOLS ==========
function renderSchools() {
  const list = document.getElementById("school-list"),
    empty = document.getElementById("school-empty");

  if (!schools.length) {
    list.innerHTML = "";
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";
  list.innerHTML = schools
    .map((s) => {
      const stats = getSchoolStats(s);
      let sc = "complete",
        st = "All Complete";
      if (stats.issues > 0) {
        sc = "issues";
        st = stats.issues + " Issues";
      } else if (stats.pending > 0) {
        sc = "pending";
        st = stats.pending + " Pending";
      }

      const ss = isDeadlinePassed(s.startDeadline) ? "expired" : s.startDeadline ? "active" : "pending";
      const es = isDeadlinePassed(s.endDeadline) ? "expired" : s.endDeadline ? "active" : "pending";

      return `<div class="school-card" onclick="selectSchool('${s.id}')">
        <div class="school-info">
          <div class="school-header"><h3>${s.name}</h3>
          ${
            isAdmin()
              ? `<button class="kit-menu" onclick="event.stopPropagation();deleteSchool('${s.id}')">🗑️</button>`
              : ""
          }</div>
          <div class="school-meta">
            <span class="status-dot ${sc}"></span>
            <span>${(s.kits || []).length} Kits • ${st}</span>
          </div>
          <div class="school-deadlines">
            <span><span class="deadline-dot ${ss}"></span> Start: ${formatDate(s.startDeadline)}</span>
            <span><span class="deadline-dot ${es}"></span> End: ${formatDate(s.endDeadline)}</span>
          </div>
        </div>
        <span class="chevron">›</span>
      </div>`;
    })
    .join("");
}

function getSchoolStats(school) {
  let pending = 0,
    issues = 0;
  (school.kits || []).forEach((k) => {
    const s = getKitStatus(school.id, k.id);
    if (s === "pending") pending++;
    else if (s === "issues") issues++;
  });
  return { pending, issues };
}

function filterSchools() {
  const q = document.getElementById("school-search").value.toLowerCase();
  document.querySelectorAll(".school-card").forEach((c) => {
    c.style.display = c.querySelector("h3").textContent.toLowerCase().includes(q) ? "flex" : "none";
  });
}

function selectSchool(id) {
  currentSchool = schools.find((s) => s.id === id);
  document.getElementById("nav-school-name").textContent = currentSchool.name;
  document.getElementById("nav-school-name2").textContent = currentSchool.name;
  showScreen("kit-screen");
}

// ✅ add school (admin only via UI button; inserts user_id = null)
async function addSchool() {
  if (!isAdmin()) return;

  const name = document.getElementById("new-school-name").value.trim();
  const courseType = document.getElementById("new-school-course-type").value || "robotics";
  if (!name) {
    alert("Enter school name");
    return;
  }

  const { data, error } = await db
    .from("schools")
    .insert({
      name: name,
      user_id: currentUserId || null,
      course_type: courseType,
      start_deadline:
        document.getElementById("new-school-start-deadline").value || null,
      end_deadline:
        document.getElementById("new-school-end-deadline").value || null,
    })
    .select();

  console.log("Add school result:", data, error);

  if (error) {
    alert(error.message);
    return;
  }

  closeModal("add-school-modal");
  document.getElementById("new-school-name").value = "";
  document.getElementById("new-school-course-type").value = "robotics";
  document.getElementById("new-school-start-deadline").value = "";
  document.getElementById("new-school-end-deadline").value = "";

  await loadData();

  renderSchools();
}

// DELETE SCHOOL (admin only)
async function deleteSchool(schoolId) {
  if (!isAdmin()) return;

  if (!confirm("Delete this school and ALL its kits and inventory? This cannot be undone.")) return;

  // delete part_counts first (FK dependency)
  const { data: kits } = await db
    .from("kits")
    .select("kit_id")
    .eq("school_id", schoolId);

  if (kits && kits.length) {
    const kitIds = kits.map(k => k.kit_id);

    await db.from("part_counts").delete().in("kit_id", kitIds);
    await db.from("bio_part_counts").delete().in("kit_id", kitIds);
    await db.from("part_count_audit").delete().in("kit_id", kitIds);
    await db.from("kits").delete().in("kit_id", kitIds);
  }

  const { error } = await db
    .from("schools")
    .delete()
    .eq("school_id", schoolId);

  if (error) {
    alert("Delete failed: " + error.message);
    return;
  }

  await loadData();
  renderSchools();
}


function openSchoolSettings() {
  alert("Settings coming soon.");
}

async function addKit() {
  if (!currentSchool) return;

  if (!isAdmin() && currentSchool.userId !== currentUserId) {
    alert("Not allowed");
    return;
  }
  const name = document.getElementById("new-kit-name").value.trim();

  const { data, error } = await db
    .from("kits")
    .insert({
      school_id: currentSchool.id,
      name: name || null,
    })
    .select();

  console.log("Add kit result:", data, error);

  if (error) {
    alert(error.message);
    return;
  }

  closeModal("add-kit-modal");
  document.getElementById("new-kit-name").value = "";

  const schoolId = currentSchool.id;

  await loadData();

  currentSchool = schools.find((s) => s.id === schoolId);

  renderKits();
}

async function deleteKit(kitId) {
  if (!isAdmin()) return;

  if (!confirm("Delete this kit?")) return;

  const tableName = currentSchool.courseType === "bio" ? "bio_part_counts" : "part_counts";
  await db.from(tableName).delete().eq("kit_id", kitId);
  await db.from("part_count_audit").delete().eq("kit_id", kitId);

  const { error } = await db
    .from("kits")
    .delete()
    .eq("kit_id", kitId);

  if (error) {
    alert("Delete failed: " + error.message);
    return;
  }

  const prevSchoolId = currentSchool?.id;

  await loadData();

  currentSchool = schools.find(s => s.id === prevSchoolId);

  renderKits();
}



// ========== KITS ==========
function updateKitUI() {
  document.getElementById("add-kit-btn").style.display = "block";
  document.getElementById("school-settings-btn").style.display = isAdmin() ? "block" : "none";

  const alert = document.getElementById("kit-deadline-alert");
  let html = "";

  if (!isAdmin()) {
    const sd = daysUntil(currentSchool.startDeadline),
      ed = daysUntil(currentSchool.endDeadline);

    if (sd !== null && sd > 0 && sd <= 3)
      html += `<div class="alert-box warning">⏰ Start deadline in ${sd} day${sd > 1 ? "s" : ""}</div>`;

    if (ed !== null && ed > 0 && ed <= 3)
      html += `<div class="alert-box warning">⏰ End deadline in ${ed} day${ed > 1 ? "s" : ""}</div>`;

    if (isDeadlinePassed(currentSchool.startDeadline) && isDeadlinePassed(currentSchool.endDeadline)) {
      html = '<div class="alert-box danger">🔒 All deadlines passed - View only</div>';
    }
  }

  alert.innerHTML = html;
}

function renderKits() {
  const grid = document.getElementById("kit-grid"),
    empty = document.getElementById("kit-empty"),
    kits = currentSchool.kits || [];

  let pending = 0,
    issues = 0;

  kits.forEach((k) => {
    const s = getKitStatus(currentSchool.id, k.id);
    if (s === "pending") pending++;
    else if (s === "issues") issues++;
  });

  document.getElementById("pending-count").textContent = pending;
  document.getElementById("issues-count").textContent = issues;

  document.querySelectorAll(".filter-btn").forEach((b) =>
    b.classList.toggle("active", b.dataset.filter === currentFilter)
  );

  const filtered = kits.filter((k) => currentFilter === "all" || getKitStatus(currentSchool.id, k.id) === currentFilter);

  if (!kits.length) {
    grid.innerHTML = "";
    empty.style.display = "block";
    empty.innerHTML = "<p>No kits yet</p>";
    return;
  }

  if (!filtered.length) {
    grid.innerHTML = "";
    empty.style.display = "block";
    empty.innerHTML = `<p>No ${currentFilter} kits</p>`;
    return;
  }

  empty.style.display = "none";
  grid.innerHTML = filtered
    .map((k) => {
      const idx = kits.indexOf(k) + 1,
        status = getKitStatus(currentSchool.id, k.id),
        miss = getMissing(currentSchool.id, k.id);

      let sh =
        status === "complete"
          ? '<div class="kit-status complete">● Complete</div>'
          : status === "issues"
          ? `<div class="kit-status issues">● ${miss} Missing</div>`
          : '<div class="kit-status pending">● Pending</div>';

      return `<div class="kit-card" onclick="selectKit('${k.id}')">
        <div class="kit-header">
          <span class="kit-name">${k.name || "Kit " + idx}</span>
          ${isAdmin() ? `<button class="kit-menu" onclick="event.stopPropagation();deleteKit('${k.id}')">🗑️</button>` : ""}
        </div>
        ${sh}
      </div>`;
    })
    .join("");
}

function getKitStatus(schoolOrId, kid) {
  const school =
    typeof schoolOrId === "object"
      ? schoolOrId
      : schools.find((s) => s.id === schoolOrId) || currentSchool;
  let endFilled = 0,
    hasIssue = false;
  const parts = getPartsForSchool(school);

  parts.forEach((p) => {
    const d = inventoryData[invKey(kid, p.id)];
    if (d) {
      if (d.end !== undefined && d.end !== "") {
        endFilled++;
        const sv = d.start !== "" && d.start !== undefined ? parseInt(d.start) : p.expected;
        if (parseInt(d.end) < sv) hasIssue = true;
      }
    }
  });

  const total = parts.length;
  if (hasIssue) return "issues";
  if (endFilled === total) return "complete";
  return "pending";
}

function getMissing(_sid, kid) {
  const school =
    typeof _sid === "object"
      ? _sid
      : schools.find((s) => s.id === _sid) || currentSchool;
  let m = 0;
  const parts = getPartsForSchool(school);

  parts.forEach((p) => {
    const d = inventoryData[invKey(kid, p.id)];
    if (d && d.end !== undefined && d.end !== "") {
      const sv = d.start !== "" && d.start !== undefined ? parseInt(d.start) : p.expected;
      if (parseInt(d.end) < sv) m += sv - parseInt(d.end);
    }
  });

  return m;
}

function setFilter(f) {
  currentFilter = f;
  renderKits();
}

function selectKit(id) {
  currentKit = currentSchool.kits.find((k) => k.id === id);
  const idx = currentSchool.kits.indexOf(currentKit) + 1;
  document.getElementById("nav-kit-name").textContent = currentKit.name || "Kit " + idx;
  document.getElementById("inventory-title").textContent = (currentKit.name || "Kit " + idx) + " Inventory";

  hasUnsavedChanges = false;
  pendingChanges = {};
  currentSemester = "start";

  showScreen("inventory-screen");
}

// ========== INVENTORY (rest unchanged from your previous version) ==========
function updateInventoryUI() {
  const canS = canEditSemester("start"),
    canE = canEditSemester("end"),
    canC = currentSemester === "start" ? canS : canE;

  document.getElementById("start-lock").textContent = canS ? "" : " 🔒";
  document.getElementById("end-lock").textContent = canE ? "" : " 🔒";

  document.querySelectorAll(".semester-tab").forEach((t) => {
    t.classList.toggle("active", t.dataset.sem === currentSemester);
    t.classList.toggle("locked", t.dataset.sem === "start" ? !canS : !canE);
  });

  const di = document.getElementById("deadline-info"),
    df = currentSemester === "start" ? "startDeadline" : "endDeadline",
    dl = currentSchool[df];

  if (dl) {
    const days = daysUntil(dl);
    if (isDeadlinePassed(dl)) {
      di.style.display = "flex";
      di.className = "deadline-info expired";
      di.innerHTML = `🔒 Deadline passed (${formatDate(dl)})${isAdmin() ? " - Admin override" : ""}`;
    } else if (days <= 3) {
      di.style.display = "flex";
      di.className = "deadline-info";
      di.innerHTML = `⏰ ${days} day${days !== 1 ? "s" : ""} until deadline`;
    } else {
      di.style.display = "flex";
      di.className = "deadline-info active";
      di.innerHTML = `✓ Deadline: ${formatDate(dl)}`;
    }
  } else di.style.display = "none";

  document.getElementById("clear-btn").style.display = canC ? "block" : "none";
  document.getElementById("save-btn").style.display = canC ? "block" : "none";
}

function setSemester(s) {
  currentSemester = s;
  renderInventory();
  updateInventoryUI();
}

function renderInventory() {
  updateSaveStatus();
  const canE = canEditSemester(currentSemester);
  const categories = getCategoriesForSchool(currentSchool);

  document.getElementById("categories").innerHTML = categories
    .map(
      (cat) => `
      <div class="category">
        <div class="category-header" onclick="toggleCategory('${cat.name}')">
          <span class="category-name">${cat.icon} ${cat.name}</span>
          <span class="category-chevron" id="chev-${cat.name}">▼</span>
        </div>
        <div class="category-items" id="cat-${cat.name}" style="display:none;">
          ${cat.parts.map((p) => renderPart(p, canE)).join("")}
        </div>
      </div>`
    )
    .join("");
}

function toggleCategory(name) {
  const content = document.getElementById(`cat-${name}`);
  const chev = document.getElementById(`chev-${name}`);

  if (!content) return;

  const isOpen = content.style.display === "block";

  content.style.display = isOpen ? "none" : "block";

  if (chev) {
    chev.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";
  }
}

function getCategoryIconForPart(part) {
  const cat = getCategoriesForSchool(currentSchool).find((c) => c.parts.includes(part));
  return cat?.icon || "📦";
}

function renderPartIcon(part) {
  const fallbackIcon = getCategoryIconForPart(part);

  if (!part.image) {
    return fallbackIcon;
  }

  return `<img src="${part.image}" alt="${part.name}" class="part-img" onerror="this.replaceWith(document.createTextNode('${fallbackIcon}'))">`;
}



function renderPart(part, canE) {
  const key = invKey(currentKit.id, part.id),
    d = inventoryData[key] || {},
    pend = pendingChanges[key] || {};

  const val = pend[currentSemester] !== undefined ? pend[currentSemester] : d[currentSemester] ?? "";
  const num = val === "" ? null : parseInt(val);

  let badge = '<span class="part-badge empty">—</span>';
  if (num !== null) {
    badge =
      num >= part.expected ? '<span class="part-badge ok">OK</span>' : `<span class="part-badge missing">-${part.expected - num}</span>`;
  }

  const mDis = !canE || num === null || num <= 0 ? "disabled" : "";
  const pDis = !canE || num >= part.expected ? "disabled" : "";

  return `<div class="part-row" data-part="${part.id}">
    <div class="part-info">
      <div class="part-icon">
        ${renderPartIcon(part)}
      </div>
      <div class="part-details">
        <div class="part-name">${part.name}</div>
        <div class="part-expected">Expected: ${part.expected}</div>
      </div>
    </div>

    <div class="part-controls">
      <div class="counter">
        <button class="counter-btn" onclick="adjust('${part.id}',-1)" ${mDis}>−</button>
        <input type="number" min="0" max="${part.expected}"
          class="counter-value"
          value="${num !== null ? num : ""}"
          data-part="${part.id}"
          onchange="handleInput(this)"
          onfocus="this.select()"
          ${!canE ? "disabled" : ""}>

        <button class="counter-btn" onclick="adjust('${part.id}',1)" ${pDis}>+</button>
      </div>
      ${badge}
    </div>
  </div>`;
}

function adjust(pid, delta) {
  if (!canEditSemester(currentSemester)) return;

  const key = invKey(currentKit.id, pid),
    part = getPartsForSchool(currentSchool).find((p) => p.id === pid);

  const d = inventoryData[key] || {},
    pend = pendingChanges[key] || {};

  let val = pend[currentSemester] !== undefined ? pend[currentSemester] : d[currentSemester] ?? "";
  val = val === "" ? part.expected : parseInt(val);
  val = Math.max(0, Math.min(val + delta, part.expected));

  if (!pendingChanges[key]) pendingChanges[key] = {};
  pendingChanges[key][currentSemester] = val;

  hasUnsavedChanges = true;
  updateSaveStatus();

  const row = document.querySelector(`[data-part="${pid}"]`);
  if (row) row.outerHTML = renderPart(part, canEditSemester(currentSemester));
}

function handleInput(inp) {
  if (!canEditSemester(currentSemester)) return;

  const pid = inp.dataset.part,
    part = getPartsForSchool(currentSchool).find((p) => p.id === pid),
    key = invKey(currentKit.id, pid);

  let val = inp.value.trim();

  if (!pendingChanges[key]) pendingChanges[key] = {};
  pendingChanges[key][currentSemester] = val === "" ? "" : Math.max(0, Math.min(parseInt(val) || 0, part.expected));

  hasUnsavedChanges = true;
  updateSaveStatus();

  const row = document.querySelector(`[data-part="${pid}"]`);
  if (row) row.outerHTML = renderPart(part, canEditSemester(currentSemester));
}

function updateSaveStatus() {
  const st = document.getElementById("save-status"),
    tx = document.getElementById("save-text"),
    canE = canEditSemester(currentSemester);

  if (!canE && !isAdmin()) {
    st.className = "save-status locked";
    tx.textContent = "🔒 Locked";
  } else if (hasUnsavedChanges) {
    st.className = "save-status unsaved";
    tx.textContent = "Unsaved";
  } else {
    st.className = "save-status saved";
    tx.textContent = "Saved";
  }
}

// Save to part_counts
async function saveChanges() {
  if (!currentKit) return;
  if (!isAdmin() && currentSchool.userId !== currentUserId) {
    alert("Not allowed");
    return;
  }

  const rows = [];

  for (const key of Object.keys(pendingChanges)) {
    const change = pendingChanges[key];
    if (change.start === undefined && change.end === undefined) continue;

    const parsed = parseInvKey(key);
    if (!parsed) continue;

    const { kit_id, part_id } = parsed;
    if (kit_id !== currentKit.id) continue;

    const existing = inventoryData[key] || {};

    const startSrc = change.start !== undefined ? change.start : existing.start;
    const endSrc   = change.end   !== undefined ? change.end   : existing.end;

    const start_actual = startSrc === "" || startSrc == null ? null : Number(startSrc);
    const end_actual   = endSrc   === "" || endSrc   == null ? null : Number(endSrc);

    rows.push({
      kit_id,
      part_id,
      start_actual,
      end_actual,
      last_updated_by: currentUserId || null,
      last_updated_at: new Date().toISOString(),
    });
  }

  if (!rows.length) {
    pendingChanges = {};
    hasUnsavedChanges = false;
    updateSaveStatus();
    return;
  }

  const tableName = currentSchool.courseType === "bio" ? "bio_part_counts" : "part_counts";
  const { error } = await db.from(tableName).upsert(rows, { onConflict: "kit_id,part_id" });

  if (error) {
    console.error(error);
    return alert("Save failed: " + error.message);
  }

  pendingChanges = {};
  hasUnsavedChanges = false;

  const prevSchoolId = currentSchool?.id || null;
  const prevKitId = currentKit?.id || null;

  await loadData();
  restoreSelection(prevSchoolId, prevKitId);

  renderInventory();
  updateInventoryUI();

  document.getElementById("save-text").textContent = "✓ Saved!";
  setTimeout(() => {
    if (!hasUnsavedChanges) updateSaveStatus();
  }, 1500);
}

function confirmClear() {
  openModal("confirm-clear-modal");
}

function clearInventory() {
  getPartsForSchool(currentSchool).forEach((p) => {
    const k = invKey(currentKit.id, p.id);
    if (!pendingChanges[k]) pendingChanges[k] = {};
    pendingChanges[k][currentSemester] = "";
  });
  hasUnsavedChanges = true;
  closeModal("confirm-clear-modal");
  renderInventory();
  updateInventoryUI();
}

// ========== MODALS ==========
function openModal(id) {
  document.getElementById(id).classList.add("active");
}
function closeModal(id) {
  document.getElementById(id).classList.remove("active");
}
document.querySelectorAll(".modal-overlay").forEach((m) =>
  m.addEventListener("click", (e) => {
    if (e.target === m) m.classList.remove("active");
  })
);

// ========== INIT ==========
// Register service worker on page load (independent of login)

(async () => {
  const savedUser = localStorage.getItem("js_user");

  if (savedUser) {
    currentUser = savedUser;

    // fetch role securely from database
    const { data, error } = await db
      .from("users")
      .select("user_id, role, is_active")
      .eq("email", currentUser)
      .limit(1);

    if (error || !data.length) {
      logout();
      return;
    }

    const user = data[0];

    if (!user.is_active) {
      alert("Your account is inactive.");
      logout();
      return;
    }

    userRole = user.role;
    currentUserId = user.user_id;

    await loadData();
    

    showScreen("menu-screen");
    registerPush(); 
  } else {
    showScreen("login-screen");
  }
})();

document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email-input").value.trim().toLowerCase();
  const pw = document.getElementById("password-input").value;

  document.getElementById("email-error").classList.remove("show");
  document.getElementById("password-error").classList.remove("show");

  if (!email.endsWith("@mystemclub.org")) {
    document.getElementById("email-error").classList.add("show");
    return;
  }

  // basic password gate (optional)
  if (pw !== PASSWORDS.admin && pw !== PASSWORDS.instructor) {
    document.getElementById("password-error").classList.add("show");
    return;
  }

  // fetch role from database
  const { data, error } = await db
    .from("users")
    .select("user_id, role, is_active")
    .eq("email", email)
    .limit(1);

  if (error || !data.length) {
    alert("User not found. Contact admin.");
    return;
  }

  const user = data[0];

  if (!user.is_active) {
    alert("Your account is inactive.");
    return;
  }

  currentUser = email;
  userRole = user.role;
  currentUserId = user.user_id;

  localStorage.setItem("js_user", currentUser);

  await loadData();
  

  showScreen("menu-screen");
  registerPush();
});

window.addEventListener("beforeunload", (e) => {
  if (hasUnsavedChanges) {
    e.preventDefault();
    e.returnValue = "";
  }
});


// ========== DASHBOARD (Admin Only) ==========
let completionChart = null;
let missingChart = null;

function renderDashboard() {
  if (!isAdmin()) return;

  // --- Stats ---
  const totalSchools = schools.length;
  let totalKits = 0;
  let completedKits = 0;
  let totalMissing = 0;

  schools.forEach(s => {
    (s.kits || []).forEach(k => {
      totalKits++;
      const status = getKitStatus(s, k.id);
      if (status === "complete") completedKits++;
      totalMissing += getMissing(s, k.id);
    });
  });

  document.getElementById("dash-stats").innerHTML = `
    <div class="dash-stat">
      <div class="dash-stat-value accent">${totalSchools}</div>
      <div class="dash-stat-label">Schools</div>
    </div>
    <div class="dash-stat">
      <div class="dash-stat-value success">${completedKits}/${totalKits}</div>
      <div class="dash-stat-label">Kits Done</div>
    </div>
    <div class="dash-stat">
      <div class="dash-stat-value danger">${totalMissing}</div>
      <div class="dash-stat-label">Missing</div>
    </div>
  `;

  // --- Completion Chart ---
  const schoolNames = schools.map(s => s.name.length > 14 ? s.name.slice(0, 12) + "…" : s.name);
  const schoolComplete = [];
  const schoolPending = [];
  const schoolIssues = [];

  schools.forEach(s => {
    let comp = 0, pend = 0, iss = 0;
    (s.kits || []).forEach(k => {
      const st = getKitStatus(s, k.id);
      if (st === "complete") comp++;
      else if (st === "issues") iss++;
      else pend++;
    });
    schoolComplete.push(comp);
    schoolPending.push(pend);
    schoolIssues.push(iss);
  });

  const ctxComp = document.getElementById("chart-completion").getContext("2d");
  if (completionChart) completionChart.destroy();
  completionChart = new Chart(ctxComp, {
    type: "bar",
    data: {
      labels: schoolNames,
      datasets: [
        { label: "Complete", data: schoolComplete, backgroundColor: "rgba(63,185,80,0.7)", borderRadius: 4 },
        { label: "Pending", data: schoolPending, backgroundColor: "rgba(210,153,34,0.7)", borderRadius: 4 },
        { label: "Issues", data: schoolIssues, backgroundColor: "rgba(248,81,73,0.7)", borderRadius: 4 },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#6b7a8d", font: { size: 11, family: "'Plus Jakarta Sans'" }, boxWidth: 12, padding: 12 },
        },
      },
      scales: {
        x: {
          stacked: true,
          ticks: { color: "#6b7a8d", font: { size: 11, family: "'Plus Jakarta Sans'" } },
          grid: { display: false },
          border: { display: false },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          ticks: { color: "#6b7a8d", stepSize: 1, font: { size: 11 } },
          grid: { color: "rgba(255,255,255,0.04)" },
          border: { display: false },
        },
      },
    },
  });

  // --- Missing Parts by Category ---
  const catMissing = {};
  schools.forEach((s) => {
    getCategoriesForSchool(s).forEach((cat) => {
      if (catMissing[cat.name] === undefined) catMissing[cat.name] = 0;
      (s.kits || []).forEach((k) => {
        cat.parts.forEach((p) => {
          const d = inventoryData[invKey(k.id, p.id)];
          if (d && d.end !== undefined && d.end !== "") {
            const sv = d.start !== "" && d.start !== undefined ? parseInt(d.start) : p.expected;
            const ev = parseInt(d.end);
            if (ev < sv) catMissing[cat.name] += sv - ev;
          }
        });
      });
    });
  });

  const catNames = Object.keys(catMissing);
  const catValues = Object.values(catMissing);
  const catColors = [
    "rgba(88,166,255,0.7)", "rgba(163,113,247,0.7)", "rgba(63,185,80,0.7)",
    "rgba(210,153,34,0.7)", "rgba(248,81,73,0.7)", "rgba(88,166,255,0.4)"
  ];

  const missCanvas = document.getElementById("chart-missing");
  const missWrap = missCanvas.parentElement;
  let missEmpty = document.getElementById("chart-missing-empty");
  const ctxMiss = missCanvas.getContext("2d");
  if (missingChart) missingChart.destroy();

  const hasMissingData = catValues.some(v => v > 0);

  if (hasMissingData) {
    missCanvas.style.display = "block";
    if (missEmpty) missEmpty.remove();
    missingChart = new Chart(ctxMiss, {
      type: "doughnut",
      data: {
        labels: catNames,
        datasets: [{
          data: catValues,
          backgroundColor: catColors.slice(0, catNames.length),
          borderWidth: 0,
          spacing: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "65%",
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: "#6b7a8d", font: { size: 11, family: "'Plus Jakarta Sans'" }, boxWidth: 12, padding: 10 },
          },
        },
      },
    });
  } else {
    missCanvas.style.display = "none";
    if (!missEmpty) {
      missEmpty = document.createElement("div");
      missEmpty.id = "chart-missing-empty";
      missEmpty.className = "dash-empty";
      missWrap.appendChild(missEmpty);
    }
    missEmpty.textContent = "No missing parts yet — complete end-of-semester counts to see data here";
  }

  // --- Top Missing Parts List ---
  const partMissing = [];
  schools.forEach(s => {
    (s.kits || []).forEach(k => {
      getPartsForSchool(s).forEach(p => {
        const d = inventoryData[invKey(k.id, p.id)];
        if (d && d.end !== undefined && d.end !== "") {
          const sv = d.start !== "" && d.start !== undefined ? parseInt(d.start) : p.expected;
          const ev = parseInt(d.end);
          if (ev < sv) {
            partMissing.push({
              part: p.name,
              school: s.name,
              kit: k.name || "Kit",
              missing: sv - ev,
            });
          }
        }
      });
    });
  });

  partMissing.sort((a, b) => b.missing - a.missing);

  const listEl = document.getElementById("dash-missing-list");
  if (!partMissing.length) {
    listEl.innerHTML = '<div class="dash-empty">No missing parts detected</div>';
  } else {
    listEl.innerHTML = partMissing.slice(0, 15).map(item => `
      <div class="dash-missing-item">
        <div class="dash-missing-info">
          <div class="dash-missing-part">${item.part}</div>
          <div class="dash-missing-detail">${item.school} · ${item.kit}</div>
        </div>
        <div class="dash-missing-count">-${item.missing}</div>
      </div>
    `).join("");
  }
}

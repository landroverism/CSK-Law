import { useEffect, useRef, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Stack,
  TextField,
  Toolbar,
  Typography,
  MenuItem,
} from "@mui/material";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  FaBalanceScale,
  FaBuilding,
  FaCalculator,
  FaCheckCircle,
  FaEnvelope,
  FaGavel,
  FaHome,
  FaKey,
  FaLandmark,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaQuoteLeft,
  FaRegClock,
  FaShieldAlt,
  FaComments,
} from "react-icons/fa";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import { MdVerified } from "react-icons/md";

// ── PALETTE ───────────────────────────────────────────────────────────────
const NAVY      = "#0B1B2E";
const NAVY_MID  = "#122338";
const NAVY_LIGHT= "#1A3050";
const NAVY_DEEP = "#060F1C";
const GOLD      = "#C8A96E";
const GOLD_LIGHT= "#DFC08A";
const GOLD_DEEP = "#A78848";
const IVORY     = "#FAFAF7";

// ── ANIMATION VARIANTS ────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.75, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
};
const fadeIn = {
  hidden: { opacity: 0 },
  show: (d = 0) => ({ opacity: 1, transition: { duration: 0.6, delay: d } }),
};

function MBox({ children, delay = 0, variant = "up" }) {
  const v = variant === "up" ? fadeUp : fadeIn;
  return (
    <Box
      component={motion.div}
      variants={v}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      custom={delay}
    >
      {children}
    </Box>
  );
}

// Gold label that appears above section headings
function SectionLabel({ children, light }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.2} mb={1.5}>
      <Box sx={{ width: 22, height: 2, bgcolor: GOLD, borderRadius: 1 }} />
      <Typography
        sx={{
          color: light ? GOLD_LIGHT : GOLD_DEEP,
          letterSpacing: 2.8,
          fontSize: "0.7rem",
          fontWeight: 600,
          textTransform: "uppercase",
        }}
      >
        {children}
      </Typography>
    </Stack>
  );
}

// ── DATA ──────────────────────────────────────────────────────────────────
const PRACTICE_AREAS = [
  { icon: <FaLandmark />, title: "Succession & Estate Planning",    desc: "Expert administration of estates, probate proceedings, grant applications, and comprehensive succession planning for families and institutions." },
  { icon: <FaHome />,     title: "Property Law & Conveyancing",     desc: "Full-service property advisory covering acquisitions, disposals, land regularisation, leases, and real estate transactions across Kenya." },
  { icon: <FaBuilding />, title: "Company & Corporate Law",         desc: "Comprehensive corporate services from incorporation through ongoing governance, transactions, and regulatory compliance for all business sizes." },
  { icon: <FaCalculator />, title: "Tax Advisory & Appeals",        desc: "Expert representation before the Tax Appeals Tribunal, dispute resolution, and advisory services for full compliance with Kenyan tax law." },
  { icon: <FaShieldAlt />, title: "Information Technology Law",     desc: "Specialist advisory in data protection, digital contracts, technology transactions, and cybersecurity law for modern businesses." },
  { icon: <FaBalanceScale />, title: "Litigation & Dispute Resolution", desc: "Vigorous representation across all levels of the Kenyan courts — civil, commercial, and family matters." },
  { icon: <FaKey />,      title: "Property Management",             desc: "End-to-end legal and administrative management of residential and commercial properties — protecting landlords' investments." },
  { icon: <FaComments />, title: "Landlord, Tenant & Rental Disputes", desc: "Specialist representation in rental disputes before the BPRT, magistrates' courts, and the Environment & Land Court." },
];

const TEAM = [
  {
    initials: "CKS",
    name: "Collins Kipkemoi Sang",
    role: "Managing Partner & Founder",
    qual: "LLB (Hons) · Advocate of the High Court of Kenya",
    bio: "Collins is the founding Managing Partner of the firm. He brings extensive experience in succession law and estate administration, complex property matters, and high-value commercial litigation. His practice includes emerging fields such as information technology law and digital regulation.",
    tags: ["Succession", "Litigation", "IT Law", "Property", "Corporate"],
    photo: "/photos/collins.png",
  },
  {
    initials: "WO",
    name: "Wesley Omondi",
    role: "Partner",
    qual: "LLB (Hons) · Advocate of the High Court of Kenya",
    bio: "Wesley is a Partner in the firm's Property Law and Corporate departments. He advises domestic and international clients on all aspects of real estate transactions, land law, and corporate structuring including company incorporation and tax registration.",
    tags: ["Property Law", "Conveyancing", "Company Law", "Incorporation"],
    photo: "/photos/wesley.png",
  },
  {
    initials: "JN",
    name: "Joseph Nzanga",
    role: "Associate Advocate",
    qual: "LLB (Hons) · Advocate of the High Court of Kenya",
    bio: "Joseph is an Associate Advocate supporting the firm's litigation, property, and corporate teams. He brings sharp analytical skills and meticulous attention to detail to every matter — from thorough legal research to front-line court proceedings.",
    tags: ["Litigation", "Conveyancing", "Debt Recovery", "Research"],
    photo: null,
  },
];

const SUPPORT_TEAM = [
  {
    initials: "CN",
    name: "Caroline Nyokabi",
    role: "Firm Administrator",
    qual: "LLB (Hons)",
    bio: "Caroline oversees the day-to-day operations of the firm. Her legal background equips her to manage client onboarding, file management, scheduling, and administrative processes with precision.",
    tags: ["Firm Operations", "Client Relations", "Administration"],
    photo: "/photos/caroline.png",
  },
  {
    initials: "PMK",
    name: "Peter Musyoka Kavoi",
    role: "Legal Researcher",
    qual: "LLB (Hons) · Postgraduate Studies, Kenya School of Law",
    bio: "Peter supports the firm's attorneys with in-depth legal research, case law analysis, statutory interpretation, and preparation of legal opinions and briefs across all practice areas.",
    tags: ["Legal Research", "Case Analysis", "Legal Writing"],
    photo: "/photos/peter-kavoi.png",
  },
];

const WHY_ITEMS = [
  { icon: <MdVerified />, title: "Deep Kenyan Market Knowledge",     desc: "Decades of combined experience navigating Kenya's legal landscape, from the Land Registry to the Court of Appeal." },
  { icon: <MdVerified />, title: "International Standards, Local Insight", desc: "Our attorneys combine internationally-regarded qualifications with intimate knowledge of Kenyan law and practice." },
  { icon: <MdVerified />, title: "Transparent Communication",         desc: "We believe clients deserve clear, honest updates at every stage. No jargon, no surprises — just straightforward guidance." },
  { icon: <MdVerified />, title: "Full-Service Capability",           desc: "From registering your company on day one to resolving a complex estate dispute, we are your firm for life." },
];

const NAV = [
  ["About",    "#about"],
  ["Practice", "#practice"],
  ["Team",     "#team"],
  ["Why Us",   "#why"],
  ["Contact",  "#contact"],
];

// ── SCROLL PROGRESS ───────────────────────────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return (
    <Box
      component={motion.div}
      style={{ scaleX, transformOrigin: "left" }}
      sx={{
        position: "fixed", top: 0, left: 0, right: 0,
        height: 3, zIndex: 9999,
        background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
        boxShadow: `0 0 14px ${GOLD}88`,
      }}
    />
  );
}

// ── NAVBAR ────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          top: 3,
          background: scrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.80)",
          backdropFilter: "blur(14px)",
          borderBottom: scrolled ? "1px solid rgba(11,27,46,0.09)" : "1px solid transparent",
          boxShadow: scrolled ? "0 6px 28px -16px rgba(11,27,46,0.2)" : "none",
          transition: "all 0.45s ease",
        }}
      >
        <Toolbar
          sx={{
            maxWidth: 1280, width: "100%", mx: "auto", px: { xs: 2, md: 5 },
            py: scrolled ? 0.8 : 1.4,
            transition: "padding 0.3s ease",
            justifyContent: "space-between",
            minHeight: "auto !important",
          }}
        >
          {/* Logo */}
          <Box
            component="a" href="#"
            sx={{ display: "flex", alignItems: "center", gap: 1.4, textDecoration: "none",
                  "&:hover .logo-box": { background: GOLD, color: NAVY } }}
          >
            <Box
              className="logo-box"
              sx={{
                width: 36, height: 36, border: `2px solid ${GOLD}`,
                display: "grid", placeItems: "center",
                color: GOLD, fontWeight: 800, fontSize: 15,
                transition: "all 0.4s ease",
              }}
            >
              C
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: NAVY, lineHeight: 1.1 }}>
                Collins Kipkemoi Sang
              </Typography>
              <Typography sx={{ fontSize: "0.6rem", color: "rgba(11,27,46,0.5)", letterSpacing: 1.5, textTransform: "uppercase" }}>
                & Company Advocates
              </Typography>
            </Box>
          </Box>

          {/* Desktop nav */}
          <Stack direction="row" spacing={4} alignItems="center" sx={{ display: { xs: "none", md: "flex" } }}>
            {NAV.map(([label, href]) => (
              <Box
                key={href} component="a" href={href}
                sx={{
                  color: "rgba(11,27,46,0.75)", textDecoration: "none",
                  fontSize: "0.8rem", fontWeight: 500, letterSpacing: 0.5,
                  position: "relative", pb: "3px",
                  "&::after": {
                    content: '""', position: "absolute",
                    bottom: 0, left: 0, width: "100%", height: 1.5,
                    background: GOLD,
                    transform: "scaleX(0)", transformOrigin: "right",
                    transition: "transform 0.35s ease",
                  },
                  "&:hover": { color: NAVY },
                  "&:hover::after": { transform: "scaleX(1)", transformOrigin: "left" },
                }}
              >
                {label}
              </Box>
            ))}
            <Button
              href="#contact"
              sx={{
                background: GOLD, color: NAVY, fontWeight: 700,
                fontSize: "0.75rem", px: 2.5, py: 0.85,
                "&:hover": { background: GOLD_LIGHT, transform: "translateY(-1px)", boxShadow: `0 8px 20px -10px ${GOLD}cc` },
                transition: "all 0.3s ease",
              }}
            >
              Consult Us
            </Button>
          </Stack>

          <IconButton sx={{ display: { xs: "flex", md: "none" }, color: NAVY }} onClick={() => setOpen(true)}>
            <HiOutlineMenuAlt3 size={24} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}
        PaperProps={{ sx: { width: 280, background: NAVY, color: "white", p: 3 } }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography sx={{ color: GOLD_LIGHT, fontWeight: 700 }}>Menu</Typography>
          <IconButton sx={{ color: "white" }} onClick={() => setOpen(false)}><HiX /></IconButton>
        </Stack>
        <Stack spacing={3}>
          {NAV.map(([label, href], i) => (
            <Box
              key={href} component="a" href={href} onClick={() => setOpen(false)}
              sx={{
                color: "white", textDecoration: "none", fontSize: "1.3rem", fontWeight: 600,
                borderBottom: "1px solid rgba(200,169,110,0.18)", pb: 1.5,
                transition: "color 0.2s, padding-left 0.2s",
                "&:hover": { color: GOLD_LIGHT, pl: 1 },
              }}
            >
              {label}
            </Box>
          ))}
          <Button href="#contact" onClick={() => setOpen(false)}
            sx={{ mt: 1, background: GOLD, color: NAVY, fontWeight: 700, py: 1.3,
                  "&:hover": { background: GOLD_LIGHT } }}
          >
            Consult Us
          </Button>
        </Stack>
      </Drawer>
    </>
  );
}

// ── HERO ──────────────────────────────────────────────────────────────────
function Hero() {
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setMouse({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <Box
      id="home"
      onMouseMove={onMove}
      sx={{
        minHeight: "100vh",
        backgroundImage: `
          linear-gradient(150deg, rgba(6,15,28,0.82) 0%, rgba(11,27,46,0.75) 55%, rgba(18,35,56,0.88) 100%),
          url('/photos/image.png')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        color: "white", position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        pt: { xs: 16, md: 18 }, pb: { xs: 8, md: 14 },
      }}
    >
      {/* Animated orbs */}
      <Box component={motion.div}
        animate={{ y: [0, -20, 0], x: [0, 14, 0] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        sx={{ position: "absolute", top: "8%", right: "4%", width: 500, height: 500,
              borderRadius: "50%", filter: "blur(50px)",
              background: `radial-gradient(circle, rgba(200,169,110,0.18), transparent 68%)` }}
      />
      <Box component={motion.div}
        animate={{ y: [0, 16, 0], x: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }}
        sx={{ position: "absolute", bottom: "-10%", left: "-6%", width: 600, height: 600,
              borderRadius: "50%", filter: "blur(55px)",
              background: `radial-gradient(circle, rgba(26,48,80,0.9), transparent 65%)` }}
      />

      {/* Cursor reactive glow */}
      <Box sx={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(600px circle at ${mouse.x}% ${mouse.y}%, rgba(200,169,110,0.07), transparent 40%)`,
        transition: "background 0.2s linear",
      }} />

      {/* Dot grid overlay */}
      <Box sx={{
        position: "absolute", inset: 0, opacity: 0.55,
        backgroundImage: `radial-gradient(rgba(200,169,110,0.1) 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
      }} />

      {/* Scroll cue */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" }, position: "absolute",
          left: "5vw", bottom: "5rem", flexDirection: "column", alignItems: "center", gap: 1,
        }}
        component={motion.div}
        animate={{ opacity: [0, 1], y: [10, 0] }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <Typography sx={{ fontSize: "0.6rem", letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
          Scroll
        </Typography>
        <Box
          component={motion.div}
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          sx={{ width: 1, height: 48, background: `linear-gradient(to bottom, ${GOLD}, transparent)`, transformOrigin: "top" }}
        />
      </Box>

      {/* Vertical motto */}
      <Box
        sx={{
          display: { xs: "none", md: "block" }, position: "absolute",
          right: "5vw", bottom: "5rem",
          writingMode: "vertical-rl", fontStyle: "italic",
          fontSize: "0.75rem", letterSpacing: 1.5,
          color: "rgba(255,255,255,0.28)",
        }}
        component={motion.div}
        animate={{ opacity: [0, 1] }}
        transition={{ delay: 1.6, duration: 1 }}
      >
        "Let justice roll on like a river…" — Amos 5:24
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        {/* Eyebrow */}
        <MBox>
          <Stack direction="row" alignItems="center" spacing={1.5} mb={4}>
            <Box sx={{ width: 36, height: 1.5, bgcolor: GOLD }} />
            <Typography sx={{ fontSize: "0.68rem", letterSpacing: 3, textTransform: "uppercase", color: GOLD_LIGHT, fontWeight: 500 }}>
              Nairobi, Kenya · Est. 2025
            </Typography>
          </Stack>
        </MBox>

        {/* Headline */}
        <MBox delay={0.1}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.6rem", sm: "3.6rem", md: "5.2rem" },
              fontWeight: 800, lineHeight: 1.05, maxWidth: 820,
              letterSpacing: "-0.02em", mb: 3,
            }}
          >
            Justice.{" "}
            <Box component="span"
              sx={{
                background: `linear-gradient(110deg, ${GOLD_LIGHT}, #f5e6c4, ${GOLD})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Integrity.
            </Box>{" "}
            Excellence.
          </Typography>
        </MBox>

        {/* Sub-text */}
        <MBox delay={0.2}>
          <Typography sx={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.75)", maxWidth: 580, lineHeight: 1.85, mb: 5, fontWeight: 300 }}>
            A full-service law firm delivering sophisticated legal counsel to individuals,
            corporations, and institutions across Kenya and the East African region.
          </Typography>
        </MBox>

        {/* CTAs */}
        <MBox delay={0.3}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "flex-start", sm: "center" }}>
            <Button
              href="#contact"
              sx={{
                background: GOLD, color: NAVY, fontWeight: 700, fontSize: "0.82rem",
                px: 4, py: 1.55,
                boxShadow: `0 14px 30px -14px ${GOLD}cc`,
                transition: "all 0.35s ease",
                "&:hover": { background: GOLD_LIGHT, transform: "translateY(-2px)", boxShadow: `0 20px 40px -14px ${GOLD}bb` },
              }}
            >
              Book a Consultation
            </Button>
            <Box component="a" href="#practice"
              sx={{
                color: "rgba(255,255,255,0.8)", textDecoration: "none",
                fontSize: "0.82rem", fontWeight: 500, letterSpacing: 0.5,
                borderBottom: "1px solid rgba(200,169,110,0.4)", pb: "2px",
                transition: "all 0.3s ease",
                "&:hover": { color: GOLD_LIGHT, borderBottomColor: GOLD_LIGHT },
              }}
            >
              Explore Practice Areas →
            </Box>
          </Stack>
        </MBox>
      </Container>
    </Box>
  );
}

// ── STATS BAR ─────────────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { num: "8+",   label: "Practice Areas" },
    { num: "EA",   label: "Regional Reach" },
    { num: "LSK",  label: "Registered Advocates" },
    { num: "100%", label: "Client Commitment" },
  ];
  return (
    <Box sx={{ bgcolor: "white", borderBottom: "1px solid rgba(11,27,46,0.07)", py: { xs: 4, md: 5 }, position: "relative" }}>
      <Box sx={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 2,
                 background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
      <Container maxWidth="lg">
        <Grid container>
          {stats.map((s, i) => (
            <Grid item xs={6} md={3} key={s.label}>
              <MBox delay={i * 0.07}>
                <Box sx={{
                  textAlign: "center", py: 1,
                  borderRight: { md: i < 3 ? "1px solid rgba(11,27,46,0.07)" : "none" },
                  "&:hover .snum": { transform: "translateY(-3px)", color: GOLD_DEEP },
                }}>
                  <Typography className="snum" sx={{
                    fontSize: { xs: "2.2rem", md: "2.8rem" }, fontWeight: 800, color: GOLD,
                    transition: "all 0.35s ease", display: "inline-block",
                  }}>
                    {s.num}
                  </Typography>
                  <Typography sx={{ fontSize: "0.68rem", letterSpacing: 2, textTransform: "uppercase", color: "rgba(11,27,46,0.5)", mt: 0.3 }}>
                    {s.label}
                  </Typography>
                </Box>
              </MBox>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

// ── ABOUT ─────────────────────────────────────────────────────────────────
function About() {
  const features = [
    { n: "01", title: "International Perspective",  desc: "Advising on Kenyan law in the context of cross-border transactions, foreign investment, and multi-jurisdictional matters." },
    { n: "02", title: "Multidisciplinary Team",     desc: "From property conveyancing to company incorporation, our team covers a comprehensive spectrum of legal disciplines." },
    { n: "03", title: "Client-Centred Approach",    desc: "Lasting relationships grounded in transparency, rigorous communication, and an unwavering commitment to your objectives." },
    { n: "04", title: "Technology-Forward Practice",desc: "Modern legal technology and document management systems to deliver efficient, timely, well-organised client service." },
  ];

  return (
    <Box id="about" sx={{ bgcolor: IVORY, py: { xs: 8, md: 13 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 5, md: 10 }} alignItems="flex-start">
          {/* Left */}
          <Grid item xs={12} md={6}>
            <MBox>
              <SectionLabel>Our Firm</SectionLabel>
              <Typography variant="h2" sx={{ fontSize: { xs: "2rem", md: "2.8rem" }, fontWeight: 800, mb: 3, lineHeight: 1.2 }}>
                A Trusted Partner in{" "}
                <Box component="span" sx={{ color: GOLD_DEEP }}>Legal Excellence</Box>
              </Typography>
              <Stack spacing={2.2} sx={{ color: "rgba(11,27,46,0.72)", lineHeight: 1.85 }}>
                <Typography>
                  Collins Kipkemoi Sang & Company Advocates is a full-service law firm
                  headquartered in Nairobi, Kenya. Founded by Managing Partner Collins Kipkemoi Sang,
                  the firm delivers{" "}
                  <Box component="strong" sx={{ color: NAVY, fontWeight: 700 }}>sophisticated legal services</Box>{" "}
                  spanning commercial law, property, corporate advisory, and complex litigation.
                </Typography>
                <Typography>
                  We combine deep local expertise with an international outlook — our attorneys are
                  trained in leading institutions, and our practice regularly serves both domestic and
                  international clients navigating Kenya's legal landscape.
                </Typography>
              </Stack>

              {/* Motto card */}
              <Box
                component={motion.div}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.35 }}
                sx={{
                  mt: 4, p: 3.5,
                  borderLeft: `4px solid ${GOLD}`,
                  background: `linear-gradient(90deg, rgba(200,169,110,0.09), rgba(200,169,110,0.01))`,
                  position: "relative", overflow: "hidden",
                }}
              >
                <FaQuoteLeft style={{ position: "absolute", top: 10, right: 14, fontSize: 60, color: GOLD, opacity: 0.12 }} />
                <Typography sx={{
                  fontSize: { xs: "1.05rem", md: "1.25rem" }, fontStyle: "italic",
                  color: NAVY, lineHeight: 1.6, mb: 1, fontWeight: 400,
                }}>
                  "Let justice roll on like a river, righteousness like a never-failing stream."
                </Typography>
                <Typography sx={{ fontSize: "0.68rem", letterSpacing: 2, textTransform: "uppercase", color: GOLD_DEEP, fontWeight: 700 }}>
                  — Amos 5:24 · Firm Motto
                </Typography>
              </Box>
            </MBox>
          </Grid>

          {/* Right — feature list */}
          <Grid item xs={12} md={6}>
            <MBox delay={0.1}>
              <Stack spacing={0}>
                {features.map((f, i) => (
                  <Box
                    key={f.n}
                    component={motion.div}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                    sx={{
                      display: "flex", gap: 3, py: 3.2,
                      borderBottom: i < features.length - 1 ? "1px solid rgba(11,27,46,0.08)" : "none",
                      "&:hover .fnum": { color: GOLD_DEEP },
                      "&:hover .ftitle": { color: GOLD_DEEP },
                    }}
                  >
                    <Typography className="fnum" sx={{ minWidth: "2.4rem", fontSize: "1.2rem", fontWeight: 800, color: GOLD, transition: "color 0.3s" }}>
                      {f.n}
                    </Typography>
                    <Box>
                      <Typography className="ftitle" sx={{ fontWeight: 700, color: NAVY, mb: 0.6, transition: "color 0.3s" }}>
                        {f.title}
                      </Typography>
                      <Typography sx={{ fontSize: "0.88rem", color: "rgba(11,27,46,0.65)", lineHeight: 1.8 }}>
                        {f.desc}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </MBox>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

// ── PRACTICE AREAS ────────────────────────────────────────────────────────
function PracticeAreas() {
  const [hovered, setHovered] = useState(null);
  return (
    <Box id="practice" sx={{ bgcolor: NAVY, py: { xs: 8, md: 13 }, position: "relative", overflow: "hidden" }}>
      {/* Decorative blobs */}
      <Box sx={{ position: "absolute", top: "5%", right: "-8%", width: 520, height: 520, borderRadius: "50%",
                 background: `radial-gradient(circle, rgba(200,169,110,0.1), transparent 68%)`, filter: "blur(50px)", pointerEvents: "none" }} />
      <Box sx={{ position: "absolute", inset: 0, opacity: 0.5,
                 backgroundImage: `radial-gradient(rgba(200,169,110,0.09) 1px, transparent 1px)`, backgroundSize: "28px 28px" }} />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <MBox>
          <SectionLabel light>What We Do</SectionLabel>
          <Typography variant="h2" sx={{ color: "white", fontWeight: 800, fontSize: { xs: "2rem", md: "2.8rem" }, mb: 1.5 }}>
            Our Practice Areas
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.65)", maxWidth: 600, lineHeight: 1.85, mb: 6, fontWeight: 300 }}>
            Comprehensive legal services across eight disciplines, delivering expert guidance at every stage.
          </Typography>
        </MBox>

        <Grid container spacing={1.5}>
          {PRACTICE_AREAS.map((p, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={p.title}>
              <MBox delay={i * 0.04}>
                <Box
                  onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                  component={motion.div}
                  animate={{
                    y: hovered === i ? -6 : 0,
                    boxShadow: hovered === i ? "0 24px 40px -20px rgba(0,0,0,0.5)" : "0 0 0 transparent",
                  }}
                  transition={{ duration: 0.35 }}
                  sx={{
                    bgcolor: hovered === i ? NAVY_LIGHT : NAVY_MID,
                    border: `1px solid ${hovered === i ? "rgba(200,169,110,0.4)" : "rgba(255,255,255,0.05)"}`,
                    p: { xs: 2.8, md: 3 }, height: "100%", position: "relative", overflow: "hidden",
                    transition: "background 0.35s, border-color 0.35s",
                    cursor: "default",
                  }}
                >
                  {/* Gold top-bar on hover */}
                  <Box sx={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 2,
                    background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
                    transform: hovered === i ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "left", transition: "transform 0.4s ease",
                  }} />

                  {/* Background number echo */}
                  <Typography sx={{
                    position: "absolute", right: -6, top: -12,
                    fontSize: "6rem", fontWeight: 800, color: "rgba(200,169,110,0.06)", lineHeight: 1, userSelect: "none",
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </Typography>

                  {/* Icon */}
                  <Box
                    component={motion.div}
                    animate={{ rotate: hovered === i ? -6 : 0, scale: hovered === i ? 1.05 : 1 }}
                    transition={{ duration: 0.35 }}
                    sx={{
                      width: 50, height: 50, mb: 2.5, display: "grid", placeItems: "center",
                      border: `1px solid ${GOLD}`,
                      color: hovered === i ? NAVY : GOLD,
                      bgcolor: hovered === i ? GOLD : "transparent",
                      fontSize: 20, transition: "background 0.35s, color 0.35s",
                    }}
                  >
                    {p.icon}
                  </Box>

                  <Typography sx={{ color: "white", fontWeight: 700, mb: 1, fontSize: "1rem", lineHeight: 1.3 }}>
                    {p.title}
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.62)", fontSize: "0.84rem", lineHeight: 1.75, fontWeight: 300 }}>
                    {p.desc}
                  </Typography>
                </Box>
              </MBox>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

// ── TEAM CARD ─────────────────────────────────────────────────────────────
function TeamCard({ m, compact }) {
  const [hov, setHov] = useState(false);

  return (
    <Card
      elevation={0}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      component={motion.div}
      animate={{ y: hov ? -6 : 0, boxShadow: hov ? "0 28px 50px -24px rgba(11,27,46,0.22)" : "0 0 0 transparent" }}
      transition={{ duration: 0.4 }}
      sx={{
        height: "100%", border: `1px solid ${hov ? GOLD : "rgba(11,27,46,0.09)"}`,
        bgcolor: compact ? "#f9f6f0" : "white", position: "relative", overflow: "hidden",
        transition: "border-color 0.35s",
      }}
    >
      {/* Gold top accent */}
      <Box sx={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
        transform: hov ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left", transition: "transform 0.45s ease",
      }} />

      {/* ── PHOTO SLOT ────────────────────────────────────────────────────
          To add a real photo, set m.photo to the file path, e.g.:
            photo: "/photos/collins.png"
          If m.photo is null the styled initials placeholder shows.          */}
      <Box sx={{
        height: compact ? 260 : 320,
        position: "relative", overflow: "hidden",
        background: `linear-gradient(160deg, ${NAVY} 0%, ${NAVY_LIGHT} 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {m.photo ? (
          <Box
            component="img"
            src={m.photo}
            alt={m.name}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center 20%",
              display: "block",
              background: `linear-gradient(160deg, ${NAVY} 0%, ${NAVY_LIGHT} 100%)`,
            }}
          />
        ) : (
          /* Styled placeholder — replace with <img> src once photos are ready */
          <Box sx={{ textAlign: "center", userSelect: "none" }}>
            <Typography sx={{ fontSize: compact ? "3rem" : "4rem", fontWeight: 800, color: GOLD, opacity: 0.55, lineHeight: 1 }}>
              {m.initials}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.6rem", letterSpacing: 2.5, mt: 1, textTransform: "uppercase" }}>
              Photo Coming Soon
            </Typography>
          </Box>
        )}

        {/* Bottom fade overlay */}
        <Box sx={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 56,
          background: "linear-gradient(to top, rgba(6,15,28,0.45), transparent)",
        }} />

        {/* Role badge */}
        <Box sx={{
          position: "absolute", bottom: 10, left: 12,
          bgcolor: "rgba(200,169,110,0.92)", px: 1.2, py: 0.3, borderRadius: 0,
        }}>
          <Typography sx={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: 1.8, textTransform: "uppercase", color: NAVY }}>
            {m.role}
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", color: NAVY, mb: 0.4 }}>
          {m.name}
        </Typography>
        <Typography sx={{ fontSize: "0.72rem", color: "rgba(11,27,46,0.5)", mb: 2, letterSpacing: 0.3 }}>
          {m.qual}
        </Typography>

        <Box sx={{ width: 28, height: 2, bgcolor: GOLD, mb: 2 }} />

        <Typography sx={{ fontSize: "0.85rem", color: "rgba(11,27,46,0.72)", lineHeight: 1.8, fontWeight: 300, mb: 2.5 }}>
          {m.bio}
        </Typography>

        <Stack direction="row" flexWrap="wrap" gap={0.7}>
          {m.tags.map((t) => (
            <Chip key={t} label={t} size="small"
              sx={{
                borderRadius: 1, fontSize: "0.62rem", letterSpacing: 0.5, textTransform: "uppercase",
                fontWeight: 600, height: 22, bgcolor: "transparent",
                border: "1px solid rgba(11,27,46,0.14)", color: "rgba(11,27,46,0.6)",
                transition: "all 0.25s",
                "&:hover": { borderColor: GOLD, color: GOLD_DEEP, bgcolor: "rgba(200,169,110,0.06)" },
              }}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

function Team() {
  return (
    <Box id="team" sx={{ bgcolor: IVORY, py: { xs: 8, md: 13 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="flex-end" sx={{ mb: { xs: 5, md: 7 } }}>
          <Grid item xs={12} md={7}>
            <MBox>
              <SectionLabel>Our People</SectionLabel>
              <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: "2rem", md: "2.8rem" }, lineHeight: 1.2 }}>
                Meet the{" "}
                <Box component="span" sx={{ color: GOLD_DEEP }}>Team</Box>
              </Typography>
            </MBox>
          </Grid>
          <Grid item xs={12} md={5}>
            <MBox delay={0.1}>
              <Typography sx={{ color: "rgba(11,27,46,0.65)", lineHeight: 1.85, fontWeight: 300 }}>
                A team of dedicated advocates committed to delivering outstanding legal outcomes
                with professionalism, integrity, and genuine care for every client.
              </Typography>
            </MBox>
          </Grid>
        </Grid>

        {/* Principal advocates */}
        <Grid container spacing={2.5}>
          {TEAM.map((m, i) => (
            <Grid item xs={12} sm={6} md={4} key={m.name}>
              <MBox delay={i * 0.08}>
                <TeamCard m={m} />
              </MBox>
            </Grid>
          ))}
        </Grid>

        {/* Divider + Support team */}
        <MBox delay={0.1}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 7, mb: 3.5 }}>
            <Box sx={{ width: 20, height: 1.5, bgcolor: GOLD }} />
            <Typography sx={{ fontSize: "0.68rem", letterSpacing: 2.5, textTransform: "uppercase", color: "rgba(11,27,46,0.45)", fontWeight: 600 }}>
              Firm Support & Research
            </Typography>
          </Stack>
        </MBox>

        <Grid container spacing={2.5}>
          {SUPPORT_TEAM.map((m, i) => (
            <Grid item xs={12} md={6} key={m.name}>
              <MBox delay={i * 0.08}>
                <TeamCard m={m} compact />
              </MBox>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

// ── WHY US ────────────────────────────────────────────────────────────────
function WhyUs() {
  return (
    <Box id="why" sx={{ bgcolor: "white", py: { xs: 8, md: 13 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 5, md: 10 }} alignItems="center">
          {/* Decorative panel */}
          <Grid item xs={12} md={5}>
            <MBox>
              <Box
                component={motion.div}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.4 }}
                sx={{
                  background: `linear-gradient(160deg, ${NAVY} 0%, ${NAVY_LIGHT} 100%)`,
                  border: `1px solid ${GOLD}`,
                  p: { xs: 4, md: 5 }, color: "white", position: "relative", overflow: "hidden",
                }}
              >
                <FaQuoteLeft style={{ position: "absolute", top: 10, right: 12, fontSize: 100, color: GOLD, opacity: 0.1 }} />
                <Typography sx={{ fontSize: "0.62rem", letterSpacing: 2.5, textTransform: "uppercase", color: GOLD_LIGHT, mb: 2.5, fontWeight: 600 }}>
                  Our Commitment
                </Typography>
                <Typography sx={{ fontSize: { xs: "1.2rem", md: "1.55rem" }, fontStyle: "italic", lineHeight: 1.5, mb: 3, fontWeight: 400 }}>
                  "We pursue every matter with the full force of our expertise and character."
                </Typography>
                <Typography sx={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)" }}>
                  — Collins Kipkemoi Sang, Managing Partner
                </Typography>

                {/* LSK badge */}
                <Box
                  component={motion.div}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  sx={{
                    mt: 4, p: 2.5, textAlign: "center",
                    background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                    boxShadow: `0 16px 36px -16px ${GOLD}bb`, display: "inline-block",
                  }}
                >
                  <Typography sx={{ fontSize: "2.4rem", fontWeight: 800, color: NAVY, lineHeight: 1 }}>P105</Typography>
                  <Typography sx={{ fontSize: "0.6rem", letterSpacing: 2, textTransform: "uppercase", color: NAVY_MID, mt: 0.5, fontWeight: 600 }}>
                    LSK Registration<br />25457 / 25
                  </Typography>
                </Box>
              </Box>
            </MBox>
          </Grid>

          {/* Feature list */}
          <Grid item xs={12} md={7}>
            <MBox delay={0.1}>
              <SectionLabel>Why Choose Us</SectionLabel>
              <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: "2rem", md: "2.8rem" }, mb: 4, lineHeight: 1.2 }}>
                Built on <Box component="span" sx={{ color: GOLD_DEEP }}>Principle</Box>{" "}
                and Proven <Box component="span" sx={{ color: GOLD_DEEP }}>Expertise</Box>
              </Typography>
              <Stack spacing={0}>
                {WHY_ITEMS.map((w, i) => (
                  <Box
                    key={w.title}
                    component={motion.div}
                    whileHover={{ x: 6 }}
                    transition={{ duration: 0.3 }}
                    sx={{
                      display: "flex", gap: 2.5, py: 2.8,
                      borderBottom: i < WHY_ITEMS.length - 1 ? "1px solid rgba(11,27,46,0.08)" : "none",
                      alignItems: "flex-start",
                      "&:hover": { "& .wi": { color: NAVY, bgcolor: GOLD } },
                    }}
                  >
                    <Box className="wi" sx={{
                      minWidth: 30, width: 30, height: 30, border: `1.5px solid ${GOLD}`,
                      display: "grid", placeItems: "center", color: GOLD,
                      fontSize: 13, transition: "all 0.35s ease",
                    }}>
                      <FaCheckCircle />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: NAVY, mb: 0.5 }}>{w.title}</Typography>
                      <Typography sx={{ fontSize: "0.88rem", color: "rgba(11,27,46,0.65)", lineHeight: 1.8, fontWeight: 300 }}>
                        {w.desc}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </MBox>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

// ── CONTACT ───────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ fname: "", lname: "", email: "", phone: "", practice: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1100);
  };

  const contactDetails = [
    { icon: <FaMapMarkerAlt />, label: "Address",   value: "Kirima House, Moktar Daddah Street, Nairobi, Kenya" },
    { icon: <FaPhoneAlt />,     label: "Telephone", value: "+254 718 076 309",          href: "tel:+254718076309" },
    { icon: <FaEnvelope />,     label: "Email",     value: "collinskipkemoilaw@outlook.com", href: "mailto:collinskipkemoilaw@outlook.com" },
    { icon: <MdVerified />,     label: "LSK Reg.",  value: "P105/25457/25" },
    { icon: <FaRegClock />,     label: "Hours",     value: "Mon–Fri 8:00 am – 5:30 pm · Sat by appointment" },
  ];

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 0, color: "white", bgcolor: "rgba(255,255,255,0.04)",
      "& fieldset": { borderColor: "rgba(200,169,110,0.25)" },
      "&:hover fieldset": { borderColor: GOLD_LIGHT },
      "&.Mui-focused fieldset": { borderColor: GOLD, borderWidth: 1 },
      "& input, & textarea, & .MuiSelect-select": { color: "white", fontWeight: 300 },
      "& input::placeholder, & textarea::placeholder": { color: "rgba(255,255,255,0.38)", opacity: 1 },
    },
    "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.55)", fontSize: "0.72rem", letterSpacing: 1.5, textTransform: "uppercase" },
    "& .MuiInputLabel-root.Mui-focused": { color: GOLD_LIGHT },
    "& .MuiSvgIcon-root": { color: GOLD },
  };

  return (
    <Box id="contact" sx={{ bgcolor: NAVY, py: { xs: 8, md: 13 }, position: "relative", overflow: "hidden" }}>
      <Box sx={{ position: "absolute", top: "-12%", right: "-10%", width: 550, height: 550, borderRadius: "50%",
                 background: `radial-gradient(circle, rgba(200,169,110,0.1), transparent 68%)`, filter: "blur(60px)", pointerEvents: "none" }} />
      <Box sx={{ position: "absolute", inset: 0, opacity: 0.45,
                 backgroundImage: `radial-gradient(rgba(200,169,110,0.09) 1px, transparent 1px)`, backgroundSize: "28px 28px" }} />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={{ xs: 5, md: 9 }}>
          {/* Contact details */}
          <Grid item xs={12} md={5}>
            <MBox>
              <SectionLabel light>Get In Touch</SectionLabel>
              <Typography variant="h2" sx={{ color: "white", fontWeight: 800, fontSize: { xs: "2rem", md: "2.6rem" }, mb: 2, lineHeight: 1.2 }}>
                Start a{" "}
                <Box component="span" sx={{ color: GOLD_LIGHT }}>Conversation</Box>
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.85, fontWeight: 300, mb: 4 }}>
                Whether you're an individual navigating a personal legal matter or a corporation
                requiring strategic counsel — reach out. All consultations are handled in the
                strictest confidence.
              </Typography>

              <Stack spacing={0}>
                {contactDetails.map((d, i) => (
                  <Box
                    key={d.label}
                    component={motion.div}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.25 }}
                    sx={{
                      display: "grid", gridTemplateColumns: "130px 1fr", py: 2.2, gap: 2,
                      borderBottom: i < contactDetails.length - 1 ? "1px solid rgba(200,169,110,0.12)" : "none",
                    }}
                  >
                    <Stack direction="row" spacing={1.2} alignItems="center">
                      <Box sx={{ color: GOLD, fontSize: 13, display: "grid", placeItems: "center" }}>{d.icon}</Box>
                      <Typography sx={{ fontSize: "0.66rem", letterSpacing: 2, textTransform: "uppercase", color: GOLD_LIGHT, fontWeight: 600 }}>
                        {d.label}
                      </Typography>
                    </Stack>
                    <Typography
                      {...(d.href ? { component: "a", href: d.href } : {})}
                      sx={{
                        fontSize: "0.88rem", fontWeight: 300, color: "white", lineHeight: 1.6,
                        textDecoration: "none",
                        ...(d.href && { "&:hover": { color: GOLD_LIGHT } }),
                      }}
                    >
                      {d.value}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </MBox>
          </Grid>

          {/* Form */}
          <Grid item xs={12} md={7}>
            <MBox delay={0.1}>
              <Box
                component="form" onSubmit={submit}
                sx={{
                  p: { xs: 3, md: 4.5 },
                  border: "1px solid rgba(200,169,110,0.2)",
                  bgcolor: "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(8px)",
                  position: "relative",
                  "&::before": { content: '""', position: "absolute", top: 0, left: 0, width: 60, height: 2, bgcolor: GOLD },
                }}
              >
                <Typography sx={{ color: "white", fontSize: "1.45rem", fontWeight: 700, mb: 3 }}>
                  Make an Enquiry
                </Typography>
                {!sent ? (
                  <Stack spacing={2.5}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="First Name" value={form.fname} onChange={set("fname")} required variant="outlined" InputLabelProps={{ shrink: true }} sx={fieldSx} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Last Name" value={form.lname} onChange={set("lname")} required variant="outlined" InputLabelProps={{ shrink: true }} sx={fieldSx} />
                      </Grid>
                    </Grid>
                    <TextField fullWidth label="Email Address" type="email" value={form.email} onChange={set("email")} required variant="outlined" InputLabelProps={{ shrink: true }} sx={fieldSx} />
                    <TextField fullWidth label="Phone Number" value={form.phone} onChange={set("phone")} variant="outlined" InputLabelProps={{ shrink: true }} sx={fieldSx} />
                    <TextField
                      fullWidth select label="Area of Interest" value={form.practice} onChange={set("practice")}
                      variant="outlined" InputLabelProps={{ shrink: true }} sx={fieldSx}
                      SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: NAVY_MID, color: "white", borderRadius: 0, border: "1px solid rgba(200,169,110,0.2)" } } } }}
                    >
                      <MenuItem value="">Select a practice area</MenuItem>
                      {PRACTICE_AREAS.map((p) => (
                        <MenuItem key={p.title} value={p.title} sx={{ "&:hover": { bgcolor: "rgba(200,169,110,0.1)" } }}>{p.title}</MenuItem>
                      ))}
                    </TextField>
                    <TextField fullWidth multiline rows={4} label="Brief Description" value={form.message} onChange={set("message")} variant="outlined" InputLabelProps={{ shrink: true }} sx={fieldSx} />
                    <Button
                      type="submit" disabled={sending}
                      sx={{
                        alignSelf: "flex-start", bgcolor: GOLD, color: NAVY, fontWeight: 700,
                        px: 4, py: 1.4, fontSize: "0.82rem",
                        boxShadow: `0 14px 28px -14px ${GOLD}cc`,
                        transition: "all 0.3s ease",
                        "&:hover": { bgcolor: GOLD_LIGHT, transform: "translateY(-1px)" },
                        "&:disabled": { bgcolor: GOLD, color: NAVY, opacity: 0.7 },
                      }}
                    >
                      {sending ? "Sending…" : "Send Enquiry →"}
                    </Button>
                  </Stack>
                ) : (
                  <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    sx={{ py: 5, textAlign: "center" }}
                  >
                    <Box sx={{
                      width: 60, height: 60, borderRadius: "50%", bgcolor: GOLD,
                      display: "grid", placeItems: "center", mx: "auto", mb: 2.5,
                      color: NAVY, fontSize: 24,
                    }}>
                      <FaCheckCircle />
                    </Box>
                    <Typography sx={{ color: "white", fontSize: "1.5rem", fontWeight: 700, mb: 1 }}>Thank you.</Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.65)", fontWeight: 300 }}>
                      We will be in touch within 24 hours.
                    </Typography>
                  </Box>
                )}
              </Box>
            </MBox>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    { title: "Practice Areas", links: [
      ["Succession & Estate",   "#practice"],
      ["Property & Conveyancing","#practice"],
      ["Company & Corporate",   "#practice"],
      ["Tax Advisory",          "#practice"],
      ["IT Law",                "#practice"],
      ["Litigation",            "#practice"],
      ["Property Management",   "#practice"],
      ["Rental & Tenancy",      "#practice"],
    ]},
    { title: "The Firm", links: [
      ["About Us",       "#about"],
      ["Our Attorneys",  "#team"],
      ["Why Choose Us",  "#why"],
      ["Contact",        "#contact"],
    ]},
  ];

  return (
    <Box component="footer" sx={{ bgcolor: NAVY_DEEP, py: { xs: 6, md: 8 }, borderTop: `1px solid rgba(200,169,110,0.14)`, position: "relative" }}>
      <Box sx={{ position: "absolute", top: 0, left: "12%", right: "12%", height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
      <Container maxWidth="lg">
        <Grid container spacing={5} sx={{ mb: 5 }}>
          {/* Brand */}
          <Grid item xs={12} md={5}>
            <Stack direction="row" spacing={1.4} alignItems="center" mb={2}>
              <Box sx={{ width: 36, height: 36, border: `2px solid ${GOLD}`, display: "grid", placeItems: "center", color: GOLD, fontWeight: 800 }}>C</Box>
              <Typography sx={{ color: GOLD_LIGHT, fontWeight: 700, fontSize: "1rem" }}>
                Collins Kipkemoi Sang & Company Advocates
              </Typography>
            </Stack>
            <Typography sx={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.42)", lineHeight: 1.85, maxWidth: 420, fontWeight: 300, mb: 3 }}>
              A full-service law firm committed to delivering justice, integrity, and excellence to every client — grounded in the timeless principle that justice must roll on like a never-failing stream.
            </Typography>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1.2} alignItems="center">
                <FaPhoneAlt style={{ color: GOLD, fontSize: 12 }} />
                <Typography sx={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.55)", fontWeight: 300 }}>+254 718 076 309</Typography>
              </Stack>
              <Stack direction="row" spacing={1.2} alignItems="center">
                <FaEnvelope style={{ color: GOLD, fontSize: 12 }} />
                <Typography sx={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.55)", fontWeight: 300 }}>collinskipkemoilaw@outlook.com</Typography>
              </Stack>
            </Stack>
          </Grid>

          {cols.map((col) => (
            <Grid item xs={6} md={3} key={col.title}>
              <Typography sx={{ fontSize: "0.68rem", letterSpacing: 2.5, textTransform: "uppercase", color: GOLD, mb: 2.5, fontWeight: 700 }}>
                {col.title}
              </Typography>
              <Stack spacing={1.4}>
                {col.links.map(([label, href]) => (
                  <Box
                    key={label} component="a" href={href}
                    sx={{
                      fontSize: "0.82rem", fontWeight: 300, color: "rgba(255,255,255,0.5)", textDecoration: "none",
                      transition: "all 0.25s",
                      "&:hover": { color: GOLD_LIGHT, pl: "4px" },
                    }}
                  >
                    {label}
                  </Box>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ borderColor: "rgba(200,169,110,0.14)", mb: 3 }} />

        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={1}>
          <Typography sx={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", fontWeight: 300 }}>
            © 2026 Collins Kipkemoi Sang & Company Advocates. All rights reserved.
          </Typography>
          <Typography sx={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", fontWeight: 300 }}>
            LSK Reg. No. P105/25457/25 · Nairobi, Kenya
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

// ── ROOT APP ──────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Box sx={{ bgcolor: "#fff", color: NAVY }}>
      <ScrollProgress />
      <Navbar />
      <Hero />
      <StatsBar />
      <About />
      <PracticeAreas />
      <Team />
      <WhyUs />
      <Contact />
      <Footer />
    </Box>
  );
}

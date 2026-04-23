import { useMemo, useState } from "react";
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
} from "@mui/material";
import { motion } from "framer-motion";
import {
  FaBalanceScale,
  FaBuilding,
  FaEnvelope,
  FaGavel,
  FaHome,
  FaLandmark,
  FaPhoneAlt,
  FaRegHandshake,
  FaShieldAlt,
  FaUserTie,
} from "react-icons/fa";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";

const NAVY = "#0B1B2E";
const NAVY_LIGHT = "#122338";
const GOLD = "#C8A96E";
const GOLD_LIGHT = "#DFC08A";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: "easeOut" },
  }),
};

const practiceAreas = [
  {
    icon: <FaLandmark />,
    title: "Succession & Estate Planning",
    description:
      "Strategic legal guidance for wills, probate, trust structures, and family estate transitions.",
  },
  {
    icon: <FaHome />,
    title: "Property Law & Conveyancing",
    description:
      "End-to-end support in sale and purchase agreements, due diligence, and title transfers.",
  },
  {
    icon: <FaBuilding />,
    title: "Corporate & Commercial",
    description:
      "Business formation, governance, compliance, and transaction support for growth-stage companies.",
  },
  {
    icon: <FaBalanceScale />,
    title: "Litigation & Dispute Resolution",
    description:
      "Strong courtroom and tribunal representation focused on practical outcomes and risk control.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Technology & Data Protection",
    description:
      "Advice on data privacy, contracts, digital regulation, and tech-risk governance.",
  },
  {
    icon: <FaGavel />,
    title: "Tax Advisory & Appeals",
    description:
      "Tax planning support and representation in assessments, objections, and appeals.",
  },
];

function MotionBox({ children, delay = 0 }) {
  return (
    <Box
      component={motion.div}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      custom={delay}
    >
      {children}
    </Box>
  );
}

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const navItems = useMemo(
    () => [
      ["About", "#about"],
      ["Practice", "#practice"],
      ["Team", "#team"],
      ["Contact", "#contact"],
    ],
    []
  );

  return (
    <Box sx={{ backgroundColor: "#fff", color: NAVY }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "rgba(255,255,255,0.94)",
          borderBottom: "1px solid rgba(11,27,46,0.08)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", maxWidth: 1200, width: "100%", mx: "auto" }}>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box
              sx={{
                width: 34,
                height: 34,
                border: `2px solid ${GOLD}`,
                display: "grid",
                placeItems: "center",
                color: GOLD,
                fontWeight: 700,
              }}
            >
              C
            </Box>
            <Typography fontWeight={700}>Collins Kipkemoi Sang & Company Advocates</Typography>
          </Stack>

          <Stack direction="row" spacing={3} sx={{ display: { xs: "none", md: "flex" } }}>
            {navItems.map(([label, href]) => (
              <Box
                key={label}
                component="a"
                href={href}
                sx={{
                  color: NAVY,
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color 0.3s ease",
                  "&:hover": { color: GOLD },
                }}
              >
                {label}
              </Box>
            ))}
          </Stack>

          <IconButton sx={{ display: { xs: "inline-flex", md: "none" } }} onClick={() => setMobileOpen(true)}>
            <HiOutlineMenuAlt3 />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 260, p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography fontWeight={700}>Menu</Typography>
            <IconButton onClick={() => setMobileOpen(false)}>
              <HiX />
            </IconButton>
          </Stack>
          <Stack spacing={2.5}>
            {navItems.map(([label, href]) => (
              <Box
                key={label}
                component="a"
                href={href}
                onClick={() => setMobileOpen(false)}
                sx={{ color: NAVY, textDecoration: "none", fontWeight: 600 }}
              >
                {label}
              </Box>
            ))}
          </Stack>
        </Box>
      </Drawer>

      <Box
        sx={{
          background: `linear-gradient(140deg, ${NAVY} 0%, ${NAVY_LIGHT} 65%, ${NAVY} 100%)`,
          color: "white",
          py: { xs: 10, md: 16 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          component={motion.div}
          animate={{ y: [0, -18, 0], x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 8 }}
          sx={{
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(200,169,110,0.26), transparent 70%)",
            position: "absolute",
            right: -40,
            top: -60,
          }}
        />
        <Container maxWidth="lg">
          <MotionBox>
            <Typography color={GOLD_LIGHT} letterSpacing={2} mb={2}>
              NAIROBI, KENYA
            </Typography>
            <Typography variant="h1" sx={{ fontSize: { xs: "2.2rem", md: "4rem" }, maxWidth: 780, lineHeight: 1.1 }}>
              Justice, Integrity, and Excellence in Every Brief.
            </Typography>
            <Typography sx={{ mt: 3, maxWidth: 650, color: "rgba(255,255,255,0.82)" }}>
              A modern, client-first law firm delivering confident representation for individuals,
              businesses, and institutions across Kenya.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={4}>
              <Button
                href="#contact"
                variant="contained"
                sx={{
                  backgroundColor: GOLD,
                  color: NAVY,
                  px: 3.5,
                  py: 1.2,
                  transition: "all 0.3s ease",
                  "&:hover": { backgroundColor: GOLD_LIGHT, transform: "translateY(-2px)" },
                }}
              >
                Book a Consultation
              </Button>
              <Button
                href="#practice"
                variant="outlined"
                sx={{
                  borderColor: GOLD,
                  color: GOLD_LIGHT,
                  px: 3.5,
                  py: 1.2,
                  transition: "all 0.3s ease",
                  "&:hover": { borderColor: GOLD_LIGHT, backgroundColor: "rgba(200,169,110,0.08)" },
                }}
              >
                Explore Services
              </Button>
            </Stack>
          </MotionBox>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 11 } }} id="about">
        <Grid container spacing={5} alignItems="center">
          <Grid item xs={12} md={6}>
            <MotionBox>
              <Typography variant="h2" sx={{ fontSize: { xs: "2rem", md: "2.8rem" }, mb: 2 }}>
                Built on Principles. Driven by Results.
              </Typography>
              <Typography color="text.secondary" lineHeight={1.85}>
                Collins Kipkemoi Sang & Company Advocates combines deep legal expertise with modern
                service delivery. We focus on clarity, speed, and strategic outcomes while
                maintaining strict professional standards.
              </Typography>
            </MotionBox>
          </Grid>
          <Grid item xs={12} md={6}>
            <MotionBox delay={0.1}>
              <Card
                elevation={0}
                sx={{
                  border: "1px solid rgba(11,27,46,0.09)",
                  background: "linear-gradient(160deg, #fff 0%, #f9f6f0 100%)",
                }}
              >
                <CardContent sx={{ p: 3.5 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                    <FaRegHandshake color={GOLD} />
                    <Typography fontWeight={700}>Client-Centered Legal Service</Typography>
                  </Stack>
                  <Typography color="text.secondary" lineHeight={1.8}>
                    Every engagement starts with understanding your business, risks, and goals.
                    We tailor legal strategy to protect your interests and unlock opportunities.
                  </Typography>
                </CardContent>
              </Card>
            </MotionBox>
          </Grid>
        </Grid>
      </Container>

      <Box id="practice" sx={{ backgroundColor: NAVY, py: { xs: 8, md: 11 } }}>
        <Container maxWidth="lg">
          <MotionBox>
            <Typography sx={{ color: GOLD_LIGHT, mb: 1.5, letterSpacing: 1.4 }}>OUR PRACTICE</Typography>
            <Typography variant="h2" sx={{ color: "white", mb: 5, fontSize: { xs: "2rem", md: "2.8rem" } }}>
              Practice Areas
            </Typography>
          </MotionBox>
          <Grid container spacing={2}>
            {practiceAreas.map((area, idx) => (
              <Grid item xs={12} sm={6} md={4} key={area.title}>
                <MotionBox delay={idx * 0.05}>
                  <Card
                    sx={{
                      height: "100%",
                      backgroundColor: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(200,169,110,0.18)",
                      color: "white",
                      transition: "all 0.35s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        borderColor: GOLD,
                        boxShadow: "0 22px 30px -24px rgba(200,169,110,0.9)",
                      },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ color: GOLD, fontSize: 22, mb: 2 }}>{area.icon}</Box>
                      <Typography variant="h6" mb={1.2}>
                        {area.title}
                      </Typography>
                      <Typography sx={{ color: "rgba(255,255,255,0.75)" }}>{area.description}</Typography>
                    </CardContent>
                  </Card>
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 11 } }} id="team">
        <MotionBox>
          <Typography sx={{ color: GOLD, mb: 1.5, letterSpacing: 1.4 }}>OUR TEAM</Typography>
          <Typography variant="h2" sx={{ mb: 5, fontSize: { xs: "2rem", md: "2.8rem" } }}>
            Trusted Legal Professionals
          </Typography>
        </MotionBox>
        <Grid container spacing={2.5}>
          {[
            "Collins Kipkemoi Sang - Managing Partner",
            "Wesley Omondi - Partner",
            "Joseph Nzanga - Associate Advocate",
          ].map((person, idx) => (
            <Grid item xs={12} md={4} key={person}>
              <MotionBox delay={idx * 0.08}>
                <Card
                  sx={{
                    border: "1px solid rgba(11,27,46,0.1)",
                    height: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": { borderColor: GOLD, transform: "translateY(-4px)" },
                  }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={1.3} alignItems="center" mb={2}>
                      <FaUserTie color={GOLD} />
                      <Typography fontWeight={700}>{person}</Typography>
                    </Stack>
                    <Typography color="text.secondary">
                      Experienced counsel offering practical legal strategy, meticulous documentation,
                      and disciplined representation.
                    </Typography>
                    <Stack direction="row" gap={1} mt={2} flexWrap="wrap">
                      <Chip size="small" label="Litigation" />
                      <Chip size="small" label="Corporate" />
                      <Chip size="small" label="Property" />
                    </Stack>
                  </CardContent>
                </Card>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box id="contact" sx={{ backgroundColor: "#f8f8f8", py: { xs: 8, md: 11 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={5}>
            <Grid item xs={12} md={5}>
              <MotionBox>
                <Typography sx={{ color: GOLD, mb: 1.5, letterSpacing: 1.4 }}>CONTACT US</Typography>
                <Typography variant="h2" sx={{ fontSize: { xs: "2rem", md: "2.6rem" }, mb: 2 }}>
                  Start a Conversation
                </Typography>
                <Typography color="text.secondary" mb={3}>
                  Reach out for confidential legal consultation and strategic support.
                </Typography>
                <Stack spacing={1.6}>
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <FaPhoneAlt color={GOLD} />
                    <Typography>+254 718 076 309</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <FaEnvelope color={GOLD} />
                    <Typography>collinskipkemoilaw@outlook.com</Typography>
                  </Stack>
                </Stack>
              </MotionBox>
            </Grid>
            <Grid item xs={12} md={7}>
              <MotionBox delay={0.1}>
                <Card elevation={0} sx={{ border: "1px solid rgba(11,27,46,0.1)" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      <TextField
                        label="Full Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        fullWidth
                      />
                      <TextField
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        fullWidth
                      />
                      <TextField
                        label="How can we help?"
                        multiline
                        rows={4}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        fullWidth
                      />
                      <Button
                        variant="contained"
                        sx={{
                          alignSelf: "flex-start",
                          backgroundColor: NAVY,
                          color: "white",
                          transition: "all 0.3s ease",
                          "&:hover": { backgroundColor: NAVY_LIGHT, transform: "translateY(-2px)" },
                        }}
                      >
                        Send Enquiry
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ backgroundColor: NAVY, color: "rgba(255,255,255,0.85)", py: 3.5 }}>
        <Container maxWidth="lg">
          <Divider sx={{ borderColor: "rgba(200,169,110,0.28)", mb: 2.5 }} />
          <Typography variant="body2">
            © 2026 Collins Kipkemoi Sang & Company Advocates. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

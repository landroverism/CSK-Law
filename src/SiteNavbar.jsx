import { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import { scrollToTop } from "./scrollToTop";

const NAVY = "#0B1B2E";
const GOLD = "#C8A96E";
const GOLD_LIGHT = "#DFC08A";

const NAV = [
  ["About", "/#about"],
  ["Practice", "/#practice"],
  ["Team", "/#team"],
  ["Why Us", "/#why"],
  ["Blogs", "/blog"],
  ["Contact", "/#contact"],
];

export default function SiteNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();

  const isNavActive = (href) => {
    if (href === "/blog") {
      return pathname === "/blog" || (pathname.startsWith("/blog/") && !pathname.startsWith("/blog/panel"));
    }
    if (href.startsWith("/#")) return pathname === "/" && hash === href.slice(1);
    return false;
  };

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const onNavClick = (href) => {
    if (href === "/blog" || href.startsWith("/blog")) scrollToTop();
  };

  const linkSx = (href, isMobile, active) => ({
    color: isMobile ? "white" : "rgba(11,27,46,0.75)",
    textDecoration: "none",
    fontSize: isMobile ? "1.3rem" : "0.8rem",
    fontWeight: isMobile ? 600 : active ? 700 : 500,
    letterSpacing: 0.5,
    position: "relative",
    pb: isMobile ? "12px" : "3px",
    borderBottom: isMobile ? "1px solid rgba(200,169,110,0.18)" : undefined,
    transition: "color 0.2s, padding-left 0.2s, transform 0.2s",
    ...(isMobile
      ? {
          "&:hover": { color: GOLD_LIGHT, pl: 1 },
        }
      : {
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 1.5,
            background: GOLD,
            transform: active ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "right",
            transition: "transform 0.35s ease",
          },
          "&:hover": { color: NAVY },
          "&:hover::after": { transform: "scaleX(1)", transformOrigin: "left" },
        }),
  });

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
            maxWidth: 1280,
            width: "100%",
            mx: "auto",
            px: { xs: 2, md: 5 },
            py: scrolled ? 0.8 : 1.4,
            transition: "padding 0.3s ease",
            justifyContent: "space-between",
            minHeight: "auto !important",
          }}
        >
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.4,
              textDecoration: "none",
              "&:hover .logo-box": { background: GOLD, color: NAVY },
            }}
          >
            <Box
              className="logo-box"
              sx={{
                width: 36,
                height: 36,
                border: `2px solid ${GOLD}`,
                display: "grid",
                placeItems: "center",
                color: GOLD,
                fontWeight: 800,
                fontSize: 15,
                transition: "all 0.4s ease",
              }}
            >
              C
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: NAVY, lineHeight: 1.1 }}>
                Collins Kipkemoi Sang
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.6rem",
                  color: "rgba(11,27,46,0.5)",
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                }}
              >
                & Company Advocates
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={4} alignItems="center" sx={{ display: { xs: "none", md: "flex" } }}>
            {NAV.map(([label, href]) => (
              <Box
                key={href}
                component={Link}
                to={href}
                onClick={() => onNavClick(href)}
                sx={linkSx(href, false, isNavActive(href))}
              >
                {label}
              </Box>
            ))}
            <Button
              component={Link}
              to="/#contact"
              sx={{
                background: GOLD,
                color: NAVY,
                fontWeight: 700,
                fontSize: "0.75rem",
                px: 2.5,
                py: 0.85,
                "&:hover": {
                  background: GOLD_LIGHT,
                  transform: "translateY(-1px)",
                  boxShadow: `0 8px 20px -10px ${GOLD}cc`,
                },
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

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { width: 280, background: NAVY, color: "white", p: 3 } }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography sx={{ color: GOLD_LIGHT, fontWeight: 700 }}>Menu</Typography>
          <IconButton sx={{ color: "white" }} onClick={() => setOpen(false)}>
            <HiX />
          </IconButton>
        </Stack>
        <Stack spacing={3}>
          {NAV.map(([label, href]) => (
            <Box
              key={href}
              component={Link}
              to={href}
              onClick={() => {
                onNavClick(href);
                setOpen(false);
              }}
              sx={linkSx(href, true, isNavActive(href))}
            >
              {label}
            </Box>
          ))}
          <Button
            component={Link}
            to="/#contact"
            onClick={() => setOpen(false)}
            sx={{
              mt: 1,
              background: GOLD,
              color: NAVY,
              fontWeight: 700,
              py: 1.3,
              "&:hover": { background: GOLD_LIGHT },
            }}
          >
            Consult Us
          </Button>
        </Stack>
      </Drawer>
    </>
  );
}

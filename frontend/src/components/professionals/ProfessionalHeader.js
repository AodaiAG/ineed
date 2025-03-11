import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, IconButton } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import styles from "../../styles/header/Header.module.css";

const ProfessionalHeader = ({ setShowPopup }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <>
      <IconButton className={styles.menuButton} onClick={toggleSidebar}>
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="left"
        open={isSidebarOpen}
        onClose={toggleSidebar}
        container={window.innerWidth >= 1025 ? document.getElementById("drawer-container") : undefined}
        PaperProps={{
          style: { position: window.innerWidth >= 1025 ? "absolute" : "fixed" },
        }}
        BackdropProps={{
          style: { position: window.innerWidth >= 1025 ? "absolute" : "fixed" },
        }}
      >
        <Box className={styles.sidebarContainer} role="presentation" onClick={toggleSidebar}>
          <List>
            <ListItem button onClick={() => console.log("Go to Dashboard")}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="דף הבית" />
            </ListItem>

            <ListItem button onClick={() => setShowPopup(true)}>
              <ListItemIcon>
                <LanguageIcon />
              </ListItemIcon>
              <ListItemText primary="שפה" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default ProfessionalHeader;

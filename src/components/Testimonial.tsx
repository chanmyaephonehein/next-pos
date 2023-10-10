import {
  Avatar,
  Box,
  Divider,
  Fade,
  Paper,
  Slide,
  Typography,
} from "@mui/material";
import Image from "next/image";
import pic1 from "../assets/pic1.jpeg";
import pic2 from "../assets/pic2.jpeg";
import pic3 from "../assets/pic3.jpeg";
import { useRef, useState } from "react";

const testimonials = [
  {
    name: "Tom",
    company: "Tasty Foods Co. Ltd",
    avatar: pic1,
    description: `We increased our sale by 120% during the first 3 months of using Foodie POS. Easy and simple to use. 
        Super duper recommended for everyone who are less tech savy. 5/5`,
  },
  {
    name: "Hailey,",
    company: "Waa T Co. Ltd",
    avatar: pic2,
    description: `Our customers love Foodie POS. Quick and easy with QR code ordering. We now spend more time taking 
        care of our customers instead of taking orders manually. Thanks to Foodie POS!`,
  },
  {
    name: "Zen",
    company: "Swey Mel Co. Ltd",
    avatar: pic3,
    description: `Integrated system. Easy to use. Very satisfied. Highly recommended for everyone. 
      Foodie POS customer service is a top-notch! They are always there when we need help. 5 starsss!`,
  },
];

const Testimonials = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-evenly",
        my: 5,
        minHeight: 350,
        flexWrap: "wrap",
      }}
    >
      {testimonials.map((item) => {
        return (
          <Slide direction="up" in key={item.description}>
            <Paper
              sx={{
                width: 300,
                height: 180,
                p: 2,
                mb: 3,
                borderRadius: 3,
                position: "relative",
                bgcolor: "#1B9C85",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Avatar alt={item.name} sx={{ mr: 2 }}>
                  <Image src={item.avatar} alt={item.name} fill />
                </Avatar>
                <Box>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontStyle: "italic",
                      color: "#E8F6EF",
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontStyle: "italic",
                      color: "#E8F6EF",
                    }}
                  >
                    {item.company}
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant="body1"
                sx={{ fontSize: "16px", color: "#E8F6EF" }}
              >
                {item.description}
              </Typography>
            </Paper>
          </Slide>
        );
      })}
    </Box>
  );
};

export default Testimonials;

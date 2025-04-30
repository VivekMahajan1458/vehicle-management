import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/system';

const ProfileContainer = styled(Container)({
    marginTop: '40px',
});

const ProfilePaper = styled(Paper)({
    padding: '24px',
});

function ProfilePage() {
    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <ProfileContainer maxWidth="md">
                <ProfilePaper elevation={3}>
                    <Typography variant="h4" gutterBottom>My Profile</Typography>
                    <Box>
                        <Typography variant="body1"><strong>Name:</strong> Vivek Sardar Mahajan</Typography>
                        <Typography variant="body1"><strong>Phone No.:</strong> XXXX-X9557</Typography>
                        <Typography variant="body1"><strong>Email:</strong> vivekmahajan1458@gmail.com</Typography>
                        <Typography variant="body1"><strong>Employee ID:</strong> 6969</Typography>
                        <Typography variant="body1"><strong>Designation:</strong> Berozgar</Typography> {/* Add your designation */}
                    </Box>
                </ProfilePaper>
            </ProfileContainer>
        </motion.div>
    );
}

export default ProfilePage;
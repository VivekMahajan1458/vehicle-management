import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import { styled } from '@mui/system';

const ProfileContainer = styled(Container)({
    marginTop: '40px',
});

const ProfilePaper = styled(Paper)({
    padding: '24px',
});

function ProfilePage() {
    return (
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
    );
}

export default ProfilePage;
import React from 'react';
import { Modal, Paper, CircularProgress, Typography, Container } from '@mui/material';

const LoadingModal = ({ loading, setLoading, message = "Editando" }) => (
    <Modal
        open={loading}
        onClose={() => setLoading(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Container maxWidth="sm" sx={{ display: "flex", height: "100vh", justifyItems: "center", alignItems: "center", marginTop: "2rem", marginBottom: "2rem" }}>
            <Paper
                elevation={3}
                sx={{
                    width: "95%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "1.5rem",
                    gap: "1rem"
                }}>
                <CircularProgress />
                <Typography id="modal-modal-description" sx={{ ml: 2 }}>
                    {message}
                </Typography>
            </Paper>
        </Container>
    </Modal>
);

export default LoadingModal;

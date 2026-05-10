import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ variant = 'primary', size = 'lg', text = 'Загрузка...' }) => {
    return (
        <div className="text-center mt-5 py-5">
            <Spinner
                animation="border"
                variant={variant}
                size={size}
                role="status"
            >
                <span className="visually-hidden">Загрузка...</span>
            </Spinner>
            {text && <p className="mt-3 text-muted">{text}</p>}
        </div>
    );
};

export default LoadingSpinner;
import React from 'react';

import { useRouter } from 'next/navigation';

import { IconButton, Typography, Box } from '@mui/material';


type goBackProps = {
  title: string;
  description: string;
};


const GoBack = ({title, description} : goBackProps) => {

  const router = useRouter();

  const handleGoBack = () =>{
    router.back();
  }

  return (
    <Box className="flex items-center gap-4 p-2 mb-4">
      <IconButton
        aria-label="back"
        className="border border-gray-300 rounded-lg h-10 w-10"
      >
        <i onClick={handleGoBack} className="tabler-arrow-left" />
      </IconButton>

      <Box>
        <Typography
          variant="h4"
          component="h1"
          className="font-bold text-gray-800"
        >
          {title}
        </Typography>
        <Typography variant="body1" className="text-gray-500">
         {description}
        </Typography>
      </Box>
    </Box>
  );
};

export default GoBack;
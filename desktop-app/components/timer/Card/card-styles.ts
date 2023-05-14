import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({

    box: {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    
    title: {
        flex: 1,
        fontWeight: 700,        
    },

}));
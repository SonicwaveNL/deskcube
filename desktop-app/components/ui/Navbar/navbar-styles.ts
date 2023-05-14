import { createStyles, rem } from '@mantine/core';

export const useStyles = createStyles((theme) => ({

    navbar: {
        paddingTop: 0,
        height: 'auto',
        minHeight: '100vh',
    },

    section: {
        marginTop: 0,
        marginLeft: `calc(${theme.spacing.md} * -1)`,
        marginRight: `calc(${theme.spacing.md} * -1)`,
        marginBottom: 0,
        // marginBottom: theme.spacing.md,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',

        '&:not(:last-of-type)': {
            borderBottom: `${rem(1)} solid ${theme.colors.dark[4]}`
        },
    },
    
}));

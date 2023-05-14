import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({

    user: {
        display: 'block',
        width: '100%',
        padding: theme.spacing.md,
        color:
            theme.colorScheme === 'dark'
                ? theme.colors.dark[0]
                : theme.colors.gray[7],
        '&:hover': {
            backgroundColor:
                theme.colorScheme === 'dark'
                    ? theme.colors.dark[5]
                    : theme.colors.gray[0],
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
    },
    
    avatar: {
        radius: theme.radius.xl,
    },

    details: {
        flex: 1,
    },

    title: {
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,
    },

    description: {
        fontSize: theme.fontSizes.xs,
    },

}));
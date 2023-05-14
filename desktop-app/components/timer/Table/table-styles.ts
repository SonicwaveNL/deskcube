import { createStyles, rem } from '@mantine/core';

export const useStyles = createStyles((theme) => ({

    table: {
        borderRadius: theme.radius.xl,
    },

    item: {
        flex: 1,
        padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    },

    itemTime: {
        width: '20%',
        padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    },

    button: {
        width: rem(10),
    }

}));
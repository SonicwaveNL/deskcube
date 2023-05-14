import { createStyles, rem } from '@mantine/core';

export const useStyles = createStyles((theme) => ({

    root: {
        // backgroundColor: theme.colors.blue[3],
    },

    inner: {
        paddingTop: rem(60),
        paddingBottom: rem(120),
        paddingRight: rem(30),
        paddingLeft: rem(30),
    }

}));
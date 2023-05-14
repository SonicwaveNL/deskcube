import { createStyles, rem } from '@mantine/core';

export const useStyles = createStyles((theme) => ({

    root: {
        // backgroundColor: theme.colors.dark[6]
        // marginBottom: `calc()`;
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingTop: rem(10),
        paddingBottom: rem(10),
        paddingLeft: rem(30),
        paddingRight: rem(10),
        borderTopRightRadius: theme.radius.sm,
    },

    menu: {
        flex: 1,
        width: 'auto',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        // backgroundColor: theme.colors.blue[6]
    },

    actions: {
        width: 'auto',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        // backgroundColor: theme.colors.blue[6]
    }

}));
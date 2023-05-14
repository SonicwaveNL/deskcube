import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({

    logo: {
        display: 'block',
        width: '100%',
        // backgroundColor: theme.colors.blue[3],
        margin: 0,
        padding: theme.spacing.xs,
        // color:
        //     theme.colorScheme === 'dark'
        //         ? theme.colors.dark[0]
        //         : theme.colors.gray[7],
        // '&:hover': {
        //     backgroundColor:
        //         theme.colorScheme === 'dark'
        //             ? theme.colors.dark[5]
        //             : theme.colors.gray[0],
        //     color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        // },
    },

}));
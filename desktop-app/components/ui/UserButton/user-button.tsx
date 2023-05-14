import {
    UnstyledButton,
    UnstyledButtonProps,
    Group,
    Avatar,
    Text,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useStyles } from './user-button-styles';

export interface UserButtonProps extends UnstyledButtonProps {
    image: string;
    name: string;
    email: string;
    icon?: React.ReactNode;
}
  
export const UserButton = ({
    image,
    name,
    email,
    icon,
    ...others 
}: UserButtonProps) => {
    
    const { classes } = useStyles();

    return (
        <UnstyledButton className={classes.user} {...others}>
            <Group>
                <Avatar src={image} className={classes.avatar}/>
                <div className={classes.details}>
                    <Text className={classes.title}>
                        {name}
                    </Text>

                    <Text color="dimmed" className={classes.description}>
                        {email}
                    </Text>
                </div>
                {icon || <IconChevronRight size="0.9rem" stroke={1.5} />}
            </Group>
        </UnstyledButton>
    );
}
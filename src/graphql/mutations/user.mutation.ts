import { gql } from "@apollo/client";

export const ADD_USER = gql`
    mutation AddUser($input: IAddUser!) {
        addUser(input: $input) {
            fullname
            email
            password
        }
    }
`
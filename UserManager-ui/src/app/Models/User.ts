// export interface Address {
//   street: string;
//   suite: string;
//   city: string;
//   zipcode: string;
//   geo: {
//     lat: string;
//     lng: string;
//   };
// }

// export interface Company {
//   name: string;
//   catchPhrase: string;
//   bs: string;
// }

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  isDeleted?: boolean; 
  // website?: string;
  // role?: number | null;
//   address: Address;
//   company: Company;
}

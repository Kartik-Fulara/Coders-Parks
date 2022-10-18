import { createContext, useState, useContext } from "react";

export const ServerIdContext = createContext<any>("");

// const ServerIdFetcherContext = createContext<any>(null);

// export const ServerIdProvider = ({ children }: any) => {
//   const [serverId, setServerId] = useState("");
//   const middleware = (id: string) => {
//     setServerId(id);
//   };
//   return (
//     <ServerIdFetcherContext.Provider value={{ middleware }}>
//       <ServerIdContext.Provider value={serverId}>
//         {children}
//       </ServerIdContext.Provider>
//     </ServerIdFetcherContext.Provider>
//   );
// };

// export const useServerId = () => useContext(ServerIdContext);
// export const useServerIdMiddleware = () => useContext(ServerIdFetcherContext);

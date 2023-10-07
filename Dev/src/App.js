import React, { useEffect, useState, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { consoleAsciiArt } from "./utility/consoleLogger"
import Countdown from "./components/pages/Countdown";

function App() {

    useEffect(() => {
        consoleAsciiArt();
    }, [])

    return (
        <div>
            <BrowserRouter>
                <Routes>

                    <Route path="/">
                        <Route index element={
                            <>

                                <Countdown />

                            </>
                        } />

                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
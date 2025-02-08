"use client";
import React, { useEffect, useState } from "react";
import { Monitor, Smartphone } from "lucide-react";

const DeviceCheck = ({ children }: { children: React.ReactNode }) => {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkDevice = () => {
      setIsDesktop(window.innerWidth >= 1200);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  if (!isDesktop) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--color-light-cream)" }}
      >
        <div
          className="paper container"
          style={{
            backgroundColor: "var(--color-cream)",
            maxWidth: "500px",
            margin: "20px",
            border: "3px solid var(--color-deep-purple)",
            boxShadow: "8px 8px var(--color-lavender)",
          }}
        >
          <div className="flex flex-col items-center text-center space-y-6 p-6">
            <div className="flex items-center space-x-4">
              <div
                style={{
                  backgroundColor: "var(--color-purple-light-1)",
                  padding: "12px",
                  borderRadius: "50%",
                  border: "2px solid var(--color-deep-purple)",
                }}
              >
                <Smartphone
                  className="w-8 h-8"
                  style={{ color: "var(--color-deep-purple)" }}
                />
              </div>
              <span
                className="text-2xl"
                style={{ color: "var(--color-deep-purple)" }}
              >
                →
              </span>
              <div
                style={{
                  backgroundColor: "var(--color-purple-light-1)",
                  padding: "12px",
                  borderRadius: "50%",
                  border: "2px solid var(--color-deep-purple)",
                }}
              >
                <Monitor
                  className="w-8 h-8"
                  style={{ color: "var(--color-deep-purple)" }}
                />
              </div>
            </div>

            <div>
              <h2
                className="text-2xl font-bold"
                style={{
                  color: "var(--color-deep-purple)",
                  marginBottom: "1rem",
                }}
              >
                Oops! Desktop Only
              </h2>
              <p style={{ color: "var(--color-deep-purple)" }}>
                Just like the Friends gang hanging at Central Perk, this
                experience is best enjoyed on a bigger screen. Please visit us
                from your laptop or PC!
              </p>
            </div>

            <div
              className="border-2 rounded-lg p-4"
              style={{
                borderColor: "var(--color-lavender)",
                backgroundColor: "var(--color-purple-light-2)",
              }}
            >
              <p
                className="text-sm"
                style={{ color: "var(--color-deep-purple)" }}
              >
                💡 Fun fact: The Friends coffee shop scenes were always filmed
                on a big screen TV set, and so is our website!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default DeviceCheck;

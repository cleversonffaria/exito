import React from "react";

export const HocRenderComponent = ({
  component,
}: {
  component?: React.ComponentType | React.ReactElement;
}) => {
  if (!component) return null;

  if (React.isValidElement(component)) return component;

  const Component = component as React.ComponentType;
  return <Component />;
};

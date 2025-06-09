import React, { Component, ErrorInfo, ReactNode } from "react";
import { Text, View } from "react-native";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class InputErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("InputErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View className="h-12 bg-gym-black-400 rounded-lg border border-gym-gray-700 items-center justify-center">
          <Text className="text-gym-gray-400 text-sm">Input indisponível</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

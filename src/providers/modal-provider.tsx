import React, { useCallback, useEffect, useRef } from "react";
import { View } from "react-native";
import { Modalize } from "react-native-modalize";

import { colors } from "@/constants/colors";
import { HocRenderComponent } from "@/hoc/hoc-render-component";
import { ButtonAtom } from "@atom/button";
import { TextAtom } from "@atom/text";
import { useModal } from "@store/useModal";
import { cn } from "@utils/cn";
import { debounce } from "lodash";

export function ModalProvider() {
  const modalizeRef = useRef<Modalize>(null);
  const { config, setModalRef, reset, hide } = useModal();

  useEffect(() => {
    setModalRef(modalizeRef.current);
  }, [setModalRef]);

  const handleClose = () => {
    const currentConfig = config;
    reset();
    currentConfig?.onDismiss?.();
  };

  const debouncedActionPress = useCallback(
    debounce((onPress: () => void) => {
      onPress();
      hide();
    }, 300),
    [hide]
  );

  return (
    <Modalize
      ref={modalizeRef}
      adjustToContentHeight={config?.adjustToContentHeight ?? true}
      snapPoint={config?.snapPoint ? config.snapPoint * 100 : undefined}
      modalStyle={{
        backgroundColor: colors.black[400],
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}
      handleStyle={{
        backgroundColor: colors.gray[500],
        width: 48,
        height: 4,
        marginTop: 8,
      }}
      onClosed={handleClose}
      closeSnapPointStraightEnabled={false}
      panGestureEnabled={true}
      closeOnOverlayTap={true}
    >
      {config && (
        <View className="px-6 pt-6 pb-8">
          {config.title && (
            <TextAtom className="text-gym-gray-200 text-lg font-semibold text-center mb-2">
              {config.title}
            </TextAtom>
          )}

          {config.description && (
            <TextAtom className="text-gym-gray-200 text-lg text-center mb-6 mt-2 leading-6">
              {config.description}
            </TextAtom>
          )}

          {config.content && <HocRenderComponent component={config.content} />}

          {config.actions && config.actions.length > 0 && (
            <>
              {config.actions.map((action, index) => {
                const { title, onPress, ...buttonProps } = action;

                return (
                  <ButtonAtom.Root
                    key={index}
                    {...buttonProps}
                    onPress={() => {
                      debouncedActionPress(onPress);
                    }}
                    className={cn(
                      buttonProps.className,
                      index < (config.actions?.length || 0) - 1 ? "mb-3" : ""
                    )}
                  >
                    <ButtonAtom.Text>{title}</ButtonAtom.Text>
                  </ButtonAtom.Root>
                );
              })}
            </>
          )}
        </View>
      )}
    </Modalize>
  );
}

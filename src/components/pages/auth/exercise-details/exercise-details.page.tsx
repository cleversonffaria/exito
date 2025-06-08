import { useRef } from "react";
import { Image, ScrollView, View } from "react-native";
import Video from "react-native-video";
import { ExerciseInfoItem } from "./_components/exercise-info-item";
import { ExerciseSection } from "./_components/exercise-section";
import { useExerciseDetailsPage } from "./exercise-details.useCase";

export default function ExerciseDetailsPage() {
  const {
    selectedExercise,
    exerciseInfoData,
    getVideoSource,
    getImageSource,
    isFullscreen,
    handleFullscreenEnter,
    handleFullscreenExit,
  } = useExerciseDetailsPage();

  const videoRef = useRef<any>(null);

  if (!selectedExercise) return null;

  return (
    <View className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-6 pb-6">
          <View
            className="mb-8 rounded-2xl overflow-hidden bg-gym-black-600"
            style={{ height: 256 }}
          >
            {selectedExercise.videoUrl ? (
              <Video
                ref={videoRef}
                source={getVideoSource()}
                style={{ width: "100%", height: "100%" }}
                controls={true}
                resizeMode={isFullscreen ? "contain" : "cover"}
                repeat={true}
                muted={true}
                playWhenInactive={false}
                playInBackground={false}
                fullscreenAutorotate={false}
                fullscreenOrientation="portrait"
                allowsExternalPlayback={false}
                ignoreSilentSwitch="ignore"
                onFullscreenPlayerWillPresent={handleFullscreenEnter}
                onFullscreenPlayerWillDismiss={handleFullscreenExit}
              />
            ) : getImageSource() ? (
              <Image
                source={getImageSource()!}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full bg-gym-black-400 items-center justify-center">
                <View className="w-16 h-16 bg-gym-primary-500 rounded-full" />
              </View>
            )}
          </View>

          <View className="space-y-6">
            {exerciseInfoData.map((info, index) => (
              <ExerciseInfoItem
                key={index}
                label={info.label}
                value={info.value}
              />
            ))}

            <ExerciseSection
              title="Músculos trabalhados:"
              content={selectedExercise.muscleGroups.join(", ")}
            />

            {selectedExercise.description && (
              <ExerciseSection
                title="Descrição do exercício:"
                content={selectedExercise.description}
                className="text-base leading-6"
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

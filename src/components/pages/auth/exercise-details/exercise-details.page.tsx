import { useRef } from "react";
import { Image, ScrollView, View } from "react-native";
import Video from "react-native-video";
import {
  ExerciseSection,
  ExerciseInfoItem,
  ExerciseDetailsSkeleton,
} from "./_components";
import { useExerciseDetailsPage } from "./exercise-details.useCase";

export default function ExerciseDetailsPage() {
  const {
    exercise,
    isLoading,
    exerciseInfoData,
    getVideoSource,
    getImageSource,
    isFullscreen,
    handleFullscreenEnter,
    handleFullscreenExit,
  } = useExerciseDetailsPage();

  const videoRef = useRef<any>(null);

  if (isLoading) return <ExerciseDetailsSkeleton />;
  if (!exercise) return null;

  const hasVideo = getVideoSource();
  const hasImage = getImageSource();

  return (
    <View className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-6 pb-6 gap-1">
          <View
            className="mb-8 rounded-2xl overflow-hidden bg-gym-black-600"
            style={{ height: 256 }}
          >
            {hasVideo ? (
              <Video
                ref={videoRef}
                source={getVideoSource()!}
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
            ) : hasImage ? (
              <Image
                source={getImageSource()!}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            ) : null}
          </View>

          {exerciseInfoData.map((info, index) => (
            <ExerciseInfoItem
              key={index}
              label={info.label}
              value={info.value}
            />
          ))}

          <ExerciseSection
            title="Músculos trabalhados:"
            content={exercise.muscle_groups.join(", ")}
          />

          {exercise.description && (
            <ExerciseSection
              title="Descrição do exercício:"
              content={exercise.description}
              className="text-base leading-6"
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

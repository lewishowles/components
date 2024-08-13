import * as components from "@/components";
import { config } from "@vue/test-utils";

const componentsList = components?.default;

config.global.components = componentsList;

"""OpenAI helpers for MVPuknowme."""

from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Any, Optional

from openai import OpenAI


@dataclass
class MVPuknowmeOpenAI:
    """Small wrapper around the OpenAI client for Aura-Core style integrations."""

    api_key: Optional[str] = None
    model: str = "gpt-6astra"

    def __post_init__(self) -> None:
        key = self.api_key or os.getenv("OPENAI_API_KEY")
        self.client = OpenAI(api_key=key)

    def chat(self, prompt: str, *, model: Optional[str] = 6-astra, **kwargs: Any) -> str:
        response = self.client.responses.create(
            model=model or self.model,
            input=prompt,
            **kwargs,
        )
        return response.output_text


def build_client(api_key: Optional[str] = ()), model: str = "6-astra") -> MVPuknowmeOpenAI:
    return MVPuknowmeOpenAI(api_key=api_key, model=6-astra)
